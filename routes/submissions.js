const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all submissions
router.get('/', async (req, res) => {
    try {
        console.log('📊 Attempting to fetch submissions from Supabase...');
        
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .order('created_at', { ascending: false });

        console.log('🔍 Supabase response:');
        console.log('- Data:', data);
        console.log('- Error:', error);
        console.log('- Data length:', data ? data.length : 'null');

        if (error) {
            console.error('❌ Error fetching submissions:', error);
            return res.status(500).json({ error: 'Failed to fetch submissions', details: error });
        }

        // Parse refleksi data for table display
        const processedData = data.map(submission => {
            const processed = { ...submission };
            
            // Extract refleksi answers
            if (submission.jawaban_refleksi) {
                processed.refleksi_1 = submission.jawaban_refleksi.refleksi_1?.jawaban || '-';
                processed.refleksi_2 = submission.jawaban_refleksi.refleksi_2?.jawaban || '-';
                processed.refleksi_3 = submission.jawaban_refleksi.refleksi_3?.jawaban || '-';
                processed.refleksi_4 = submission.jawaban_refleksi.refleksi_4?.jawaban || '-';
                processed.target_upgrade = Array.isArray(submission.jawaban_refleksi.target_upgrade) 
                    ? submission.jawaban_refleksi.target_upgrade.join('<br>') 
                    : (submission.jawaban_refleksi.target_upgrade || '-');
            } else {
                processed.refleksi_1 = '-';
                processed.refleksi_2 = '-';
                processed.refleksi_3 = '-';
                processed.refleksi_4 = '-';
                processed.target_upgrade = '-';
            }
            
            // Format skor with quiz answers
            if (submission.jawaban_kuis) {
                const q1 = submission.jawaban_kuis.q1 || '-';
                const q2 = submission.jawaban_kuis.q2 || '-';
                const q3 = submission.jawaban_kuis.q3 || '-';
                const q4 = submission.jawaban_kuis.q4 || '-';
                const q5 = submission.jawaban_kuis.q5 || '-';
                processed.skor_formatted = `${submission.skor || 0}: ${q1} ${q2} ${q3} ${q4} ${q5}`;
            } else {
                processed.skor_formatted = `${submission.skor || 0}: -`;
            }
            
            return processed;
        });

        console.log('✅ Successfully processed submissions with refleksi data');
        res.json(processedData);
    } catch (err) {
        console.error('💥 Server error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// Get single submission by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching submission:', error);
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json(data);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Parse JSON fields into separate objects
router.get('/:id/parsed', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`🔍 Fetching parsed submission with ID: ${id}`);
        
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', id)
            .single();

        console.log('📊 Raw submission data:', data);
        console.log('❌ Supabase error:', error);

        if (error) {
            console.error('Error fetching submission:', error);
            return res.status(404).json({ error: 'Submission not found', details: error });
        }

        // Parse JSON fields with better handling
        const jawaban_refleksi_parsed = data.jawaban_refleksi ? 
            Object.entries(data.jawaban_refleksi).map(([key, value]) => ({ key, value })) : [];
            
        const jawaban_kuis_parsed = data.jawaban_kuis ? 
            Object.entries(data.jawaban_kuis).map(([key, value]) => ({ key, value })) : [];

        console.log('🧩 Parsed refleksi:', jawaban_refleksi_parsed);
        console.log('🧩 Parsed kuis:', jawaban_kuis_parsed);

        const parsedData = {
            ...data,
            jawaban_refleksi_parsed,
            jawaban_kuis_parsed
        };

        console.log('✅ Sending parsed data to client');
        res.json(parsedData);
    } catch (err) {
        console.error('💥 Server error in parsed route:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

module.exports = router;