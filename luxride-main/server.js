const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the current directory
app.use(express.static('.'));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// API endpoint to save driver profile
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
            driverId: driverId || 'DR-2847',
            updatedAt: new Date().toISOString()
        };

        // Save to file
        const filePath = path.join(dataDir, 'driver-profile.json');
        fs.writeFileSync(filePath, JSON.stringify(profileData, null, 2));

        console.log('Profile saved:', profileData);

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

// API endpoint to get driver profile
app.get('/api/driver/profile', (req, res) => {
    try {
        const filePath = path.join(dataDir, 'driver-profile.json');
        
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const profileData = JSON.parse(data);
            res.json({ success: true, data: profileData });
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

// API endpoint to save driver photo
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

        // Save to file
        const filePath = path.join(dataDir, 'driver-photo.json');
        fs.writeFileSync(filePath, JSON.stringify(photoData, null, 2));

        console.log('Photo saved at:', new Date().toLocaleString());

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

// API endpoint to get driver photo
app.get('/api/driver/photo', (req, res) => {
    try {
        const filePath = path.join(dataDir, 'driver-photo.json');
        
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const photoData = JSON.parse(data);
            res.json({ success: true, data: photoData });
        } else {
            res.json({ success: true, data: null });
        }
    } catch (error) {
        console.error('Error loading photo:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error loading photo' 
        });
    }
});

// API endpoint to save full driver profile (personal info, vehicle, bio)
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

        // Save to file
        const filePath = path.join(dataDir, 'driver-full-profile.json');
        fs.writeFileSync(filePath, JSON.stringify(fullProfileData, null, 2));

        console.log('Full profile saved:', fullProfileData);

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

// API endpoint to get full driver profile
app.get('/api/driver/profile/full', (req, res) => {
    try {
        const filePath = path.join(dataDir, 'driver-full-profile.json');
        
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const profileData = JSON.parse(data);
            res.json({ success: true, data: profileData });
        } else {
            // Return default data
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

// Route for index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route for signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Route for profile page
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// Route for trip history page
app.get('/triphistory', (req, res) => {
    res.sendFile(path.join(__dirname, 'triphistory.html'));
});

// Route for inbox page
app.get('/inbox', (req, res) => {
    res.sendFile(path.join(__dirname, 'inbox.html'));
});

// Route for receipt page
app.get('/receipt', (req, res) => {
    res.sendFile(path.join(__dirname, 'receipt.html'));
});

// Route for book page
app.get('/book', (req, res) => {
    res.sendFile(path.join(__dirname, 'book.html'));
});

// Route for driver index page
app.get('/driver-index', (req, res) => {
    res.sendFile(path.join(__dirname, 'driver-index.html'));
});

// Route for driver dashboard page
app.get('/driver-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'driver-dashboard.html'));
});

// Route for driver rides page
app.get('/driver-rides', (req, res) => {
    res.sendFile(path.join(__dirname, 'driver-rides.html'));
});

// Route for driver orders page
app.get('/driver-orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'driver-orders.html'));
});

// Route for driver schedule page
app.get('/driver-schedule', (req, res) => {
    res.sendFile(path.join(__dirname, 'driver-schedule.html'));
});

// Route for driver earnings page
app.get('/driver-earnings', (req, res) => {
    res.sendFile(path.join(__dirname, 'driver-earnings.html'));
});

// Route for driver profile page
app.get('/driver-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'driver-profile.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
