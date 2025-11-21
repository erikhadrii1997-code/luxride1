const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Helper function to read JSON file
function readJsonFile(filename) {
  const filePath = path.join(dataDir, filename);
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return null;
    }
  }
  return null;
}

// Helper function to write JSON file
function writeJsonFile(filename, data) {
  const filePath = path.join(dataDir, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// API Routes

// Driver Profile
app.post('/api/driver/profile', (req, res) => {
  try {
    const { firstName, lastName, driverId } = req.body;
    
    if (!firstName || !lastName) {
      return res.status(400).json({ 
        success: false, 
        message: 'First name and last name are required' 
      });
    }

    const profileData = {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      driverId: driverId || `DR-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };

    writeJsonFile('driver-profile.json', profileData);

    res.json({ 
      success: true, 
      message: 'Profile saved successfully',
      data: profileData
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving profile' 
    });
  }
});

app.get('/api/driver/profile', (req, res) => {
  try {
    const data = readJsonFile('driver-profile.json');
    
    if (data) {
      res.json({ success: true, data });
    } else {
      res.json({ 
        success: true, 
        data: { 
          firstName: 'John', 
          lastName: 'Smith', 
          fullName: 'John Smith',
          driverId: 'DR-2847'
        } 
      });
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error loading profile' 
    });
  }
});

// Driver Photo
app.post('/api/driver/photo', (req, res) => {
  try {
    const { photo, driverId } = req.body;
    
    if (!photo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Photo data is required' 
      });
    }

    const photoData = {
      photo,
      driverId: driverId || 'DR-2847',
      uploadedAt: new Date().toISOString()
    };

    writeJsonFile('driver-photo.json', photoData);

    res.json({ 
      success: true, 
      message: 'Photo saved successfully',
      uploadedAt: photoData.uploadedAt
    });
  } catch (error) {
    console.error('Error saving photo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving photo' 
    });
  }
});

app.get('/api/driver/photo', (req, res) => {
  try {
    const data = readJsonFile('driver-photo.json');
    res.json({ success: true, data: data || null });
  } catch (error) {
    console.error('Error loading photo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error loading photo' 
    });
  }
});

// Full Driver Profile
app.post('/api/driver/profile/full', (req, res) => {
  try {
    const { personalInfo, vehicleInfo, bio, driverId } = req.body;
    
    if (!personalInfo || !personalInfo.fullName || !personalInfo.email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Personal information is required' 
      });
    }

    const fullProfileData = {
      personalInfo,
      vehicleInfo,
      bio,
      driverId: driverId || 'DR-2847',
      updatedAt: new Date().toISOString()
    };

    writeJsonFile('driver-full-profile.json', fullProfileData);

    res.json({ 
      success: true, 
      message: 'Profile saved successfully',
      data: fullProfileData
    });
  } catch (error) {
    console.error('Error saving full profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving profile' 
    });
  }
});

app.get('/api/driver/profile/full', (req, res) => {
  try {
    const data = readJsonFile('driver-full-profile.json');
    
    if (data) {
      res.json({ success: true, data });
    } else {
      res.json({ 
        success: true, 
        data: {
          personalInfo: {
            fullName: 'John Smith',
            email: 'john.smith@luxride.com',
            phone: '+1 (555) 123-4567',
            dob: '1985-06-15',
            address: '123 Main St, City, State 12345',
            emergencyContact: 'Jane Smith - +1 (555) 987-6543'
          },
          vehicleInfo: {
            make: 'Toyota Camry 2022',
            licensePlate: 'ABC-123',
            color: 'Silver',
            year: '2022',
            capacity: '4',
            vin: '1HGBH41JXMN109186'
          },
          bio: 'Professional driver with 5+ years of experience. I prioritize safety, comfort, and punctuality.',
          driverId: 'DR-2847'
        }
      });
    }
  } catch (error) {
    console.error('Error loading full profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error loading profile' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Data directory: ${dataDir}`);
});

