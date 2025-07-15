require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

mongoose.connect(`${process.env.MONGODB_URL}/ip-project`, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  premium: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});
const User = mongoose.model('User', userSchema);

// Configure nodemailer (example with Gmail, replace with your SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anshrehan7@gmail.com',
    pass: 'novmxrsywzfammgj'
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', premium: user.premium });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Send user data without password
    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      premium: user.premium
    };

    res.json({ 
      message: 'Login successful',
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Making OpenRouter request for message:', message.substring(0, 50) + '...');
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku:beta',
        messages: [{ role: 'user', content: message }],
        stream: true,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://intellibot-rswr.onrender.com',
          'X-Title': 'Chat App'
        },
        responseType: 'stream'
      }
    );

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    let aiReply = '';
    response.data.on('data', (chunk) => {
      try {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonString = line.substring(6).trim();
            if (!jsonString || jsonString === '[DONE]') continue;
            
            try {
              const data = JSON.parse(jsonString);
              if (data.choices?.[0]?.delta?.content) {
                aiReply += data.choices[0].delta.content;
                res.write(`data: ${JSON.stringify({
                  content: data.choices[0].delta.content,
                  done: false
                })}\n\n`);
              }
            } catch (err) {
              console.error('Error parsing chunk:', err, jsonString);
            }
          }
        }
      } catch (err) {
        console.error('Error processing chunk:', err);
      }
    });

    response.data.on('end', () => {
      try {
        if (!aiReply) {
          res.write(`data: ${JSON.stringify({
            error: "No response received from AI",
            done: true
          })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        }
        res.end();
      } catch (err) {
        console.error('Error ending stream:', err);
        if (!res.headersSent) {
          res.end();
        }
      }
    });

    response.data.on('error', (err) => {
      console.error('Stream error:', err);
      try {
        if (!res.headersSent) {
          res.write(`data: ${JSON.stringify({
            error: "Error in streaming response",
            done: true
          })}\n\n`);
          res.end();
        }
      } catch (err) {
        console.error('Error handling stream error:', err);
        if (!res.headersSent) {
          res.end();
        }
      }
    });

  } catch (err) {
    console.error('API error:', err);
    
    // Only send error response if headers haven't been sent yet
    if (!res.headersSent) {
      // Handle rate limiting specifically
      if (err.response?.status === 429) {
        const resetTime = err.response.headers['x-ratelimit-reset'];
        const waitTime = resetTime ? Math.ceil((parseInt(resetTime) - Date.now()) / 1000) : 60;
        
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `Please wait ${waitTime} seconds before trying again`,
          retryAfter: waitTime
        });
      }

      // Handle API key errors
      if (err.response?.status === 401) {
        return res.status(401).json({
          error: 'API key error',
          message: 'The API key is invalid or has expired. Please check your OpenRouter API key.'
        });
      }

      // Handle model availability errors
      if (err.response?.status === 404) {
        return res.status(404).json({
          error: 'Model not available',
          message: 'The selected AI model is currently unavailable. Please try again later.'
        });
      }

      // Handle other errors
      return res.status(500).json({ 
        error: 'Error processing your request',
        message: err.response?.data?.error || err.message || 'Unknown error occurred'
      });
    }
  }
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imagePath = req.file.path;
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    // Optionally, delete the file after processing
    fs.unlink(imagePath, () => {});
    res.json({ text });
  } catch (err) {
    console.error('OCR error:', err);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Set SSE headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    // Call Stability AI API
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 1024,  // Using standard SDXL dimensions
        width: 1024,   // Using standard SDXL dimensions
        samples: 1,
        steps: 30,
        style_preset: "photographic"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer sk-djSt5R7iOQ608IQ66DfkmHMQIOF5bUw6OK7Ssowhh3ni90uw'
        }
      }
    );

    // Process the response
    if (response.data && response.data.artifacts && response.data.artifacts.length > 0) {
      const imageData = response.data.artifacts[0];
      
      // Convert base64 to buffer
      const imageBuffer = Buffer.from(imageData.base64, 'base64');
      
      // Generate a unique filename
      const filename = `image_${Date.now()}.png`;
      const filepath = path.join(__dirname, 'uploads', filename);
      
      // Ensure uploads directory exists
      if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
        fs.mkdirSync(path.join(__dirname, 'uploads'));
      }
      
      // Save the image file
      fs.writeFileSync(filepath, imageBuffer);
      
      // Create a URL for the image using RENDER_URL env variable
      const imageUrl = `${process.env.RENDER_URL || 'http://localhost:5000'}/uploads/${filename}`;
      
      // Send the response
      res.write(`data: ${JSON.stringify({
        imageUrl: imageUrl,
        done: true
      })}\n\n`);
      res.end();
    } else {
      throw new Error('No image data received from Stability AI');
    }

  } catch (err) {
    console.error('Image generation error:', err);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Error generating image',
        message: err.message || 'Unknown error occurred'
      });
    }
  }
});

app.post('/api/upgrade-to-premium', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.premium = true;
    await user.save();
    res.json({ message: 'User upgraded to premium', premium: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Forgot Password Endpoint
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Always respond with success to prevent email enumeration
      return res.json({ message: 'If this email is registered, a reset link has been sent.' });
    }
    // Create a reset token
    const token = jwt.sign({ id: user._id }, 'reset_secret', { expiresIn: '1h' });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    // Send email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. <a href="${resetUrl}">Click here to reset your password</a></p>`
    });
    res.json({ message: 'If this email is registered, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset Password Endpoint
app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, 'reset_secret');
    const user = await User.findOne({ _id: decoded.id, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

// Add static file serving for the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(process.env.PORT, () => console.log('Server running on port 5000'));
