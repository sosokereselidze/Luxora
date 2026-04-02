const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Fragrance = require('./models/Fragrance');

dotenv.config({ path: path.join(__dirname, '.env') });

const updateVolumes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Find all fragrances that don't have a volume field or it's empty
        const fragrances = await Fragrance.find({ 
            $or: [
                { volume: { $exists: false } },
                { volume: '' },
                { volume: null }
            ] 
        });

        console.log(`Found ${fragrances.length} fragrances missing volume.`);

        if (fragrances.length === 0) {
            console.log('All fragrances already have a volume.');
            process.exit(0);
        }

        const volumes = ['50ml', '75ml', '100ml', '100ml', '100ml']; // Weighted towards 100ml

        let updatedCount = 0;
        for (let f of fragrances) {
            const randomVolume = volumes[Math.floor(Math.random() * volumes.length)];
            f.volume = randomVolume;
            
            // Fix category capitalize
            if (f.category) {
              const cat = f.category.toLowerCase();
              if (cat === 'men') f.category = 'Men';
              else if (cat === 'women') f.category = 'Women';
              else if (cat === 'unisex') f.category = 'Unisex';
            }

            // Also ensure they have a price if it's 0 or missing
            if (!f.price || f.price === 0) {
              f.price = parseFloat((Math.random() * 150 + 100).toFixed(2));
            }
            
            await f.save();
            updatedCount++;
        }

        console.log(`Successfully updated ${updatedCount} fragrances.`);
        process.exit(0);
    } catch (err) {
        console.error('Error updating volumes:', err);
        process.exit(1);
    }
};

updateVolumes();
