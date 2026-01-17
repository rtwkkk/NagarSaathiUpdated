import React, { useState } from 'react';
import { createAlert } from '../api';
import { VerificationQueue } from './verification-queue';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Megaphone, AlertTriangle, MapPin, CheckCircle2 } from 'lucide-react';
import { TextField, MenuItem, Alert as MuiAlert, FormControl, InputLabel, Select, Box } from '@mui/material';

export function AlertsDashboard() {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        alert_type: 'EMERGENCY',
        city: '',
        ward: ''
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [refreshQueue, setRefreshQueue] = useState(0);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        try {
            await createAlert({
                title: formData.title,
                message: formData.message,
                alert_type: formData.alert_type,
                target_area: {
                    city: formData.city || undefined,
                    ward: formData.ward || undefined
                }
            });
            setStatus({ type: 'success', message: 'Alert created and sent to verification queue.' });
            setFormData({ title: '', message: '', alert_type: 'EMERGENCY', city: '', ward: '' });
            setRefreshQueue(prev => prev + 1); // Trigger queue refresh (would react to prop change if we passed it)
            // Ideally VerificationQueue should have an exposed refresh method or use a context/store.
            // For now, we'll just let the user manually refresh the queue or auto-refresh periodically.
            // Or better, we can key the component to force re-render, but that's heavy.
            // Let's rely on the manual refresh button in VerificationQueue for now or simple re-mount.
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to create alert.' });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left Column: Create Alert */}
            <div className="space-y-6">
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                        <div className="flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-red-600" />
                            <CardTitle className="text-red-900">Create New Alert</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {status && <MuiAlert severity={status.type} sx={{ mb: 3 }} onClose={() => setStatus(null)}>{status.message}</MuiAlert>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <TextField
                                fullWidth
                                label="Alert Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Heavy Rain Warning"
                                variant="outlined"
                            />

                            <TextField
                                fullWidth
                                label="Message Body"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                multiline
                                rows={4}
                                placeholder="Detailed message to be sent via WhatsApp..."
                                variant="outlined"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormControl fullWidth>
                                    <InputLabel>Alert Type</InputLabel>
                                    <Select
                                        name="alert_type"
                                        value={formData.alert_type}
                                        label="Alert Type"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="EMERGENCY">Emergency</MenuItem>
                                        <MenuItem value="WARNING">Warning</MenuItem>
                                        <MenuItem value="INFO">Information</MenuItem>
                                        <MenuItem value="TRAFFIC">Traffic</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium text-blue-900">Target Area (Optional)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        fullWidth
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        size="small"
                                        placeholder="All Cities"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Ward"
                                        name="ward"
                                        value={formData.ward}
                                        onChange={handleChange}
                                        size="small"
                                        placeholder="All Wards"
                                    />
                                </div>
                                <p className="text-xs text-blue-600 mt-2">Leave blank to target all subscribers.</p>
                            </div>

                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 h-11">
                                <AlertTriangle className="w-4 h-4" />
                                Submit for Verification
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Guidelines Card */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Best Practices
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-2">
                        <p>• Keep titles concise and clear.</p>
                        <p>• Include actionable advice in the message body.</p>
                        <p>• Double-check target areas to avoid panic.</p>
                        <p>• All alerts must be verified by a second admin before sending.</p>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Verification Queue */}
            <div className="h-full">
                {/* We pass a key to force re-render if needed, or just let it be independent */}
                <VerificationQueue key={refreshQueue} />
            </div>
        </div>
    );
}
