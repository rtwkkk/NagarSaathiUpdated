import React, { useState } from 'react';
import { subscribeUser } from '../api';
import { Button, TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Box, Typography, Alert } from '@mui/material';

export const SubscriptionPage = () => {
    const [formData, setFormData] = useState({
        phone_number: '',
        state: '',
        district: '',
        city: '',
        ward: '',
        agreed: false
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleChange = (e: any) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'agreed' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreed) {
            setStatus({ type: 'error', message: 'You must agree to receive WhatsApp alerts.' });
            return;
        }

        try {
            await subscribeUser({
                phone_number: formData.phone_number,
                state: formData.state,
                district: formData.district,
                city: formData.city,
                ward: formData.ward
            });
            setStatus({ type: 'success', message: 'Successfully subscribed to alerts!' });
        } catch (err) {
            setStatus({ type: 'error', message: 'Subscription failed. Please try again.' });
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Nagar Alert Subscription</Typography>

            {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Phone Number (with country code)"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    margin="normal"
                    placeholder="e.g. 919876543210"
                />

                <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Ward"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    required
                    margin="normal"
                />

                <FormControlLabel
                    control={<Checkbox checked={formData.agreed} onChange={handleChange} name="agreed" />}
                    label="I agree to receive verified civic alerts via WhatsApp"
                    sx={{ mt: 2 }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={!formData.agreed}
                >
                    Subscribe
                </Button>
            </form>
        </Box>
    );
};
