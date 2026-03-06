import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle } from 'lucide-react';

const Contact = () => {
    return (
        <div className="container" style={{ padding: '6rem 5%', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
                style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', border: '1px solid var(--border-color)' }}
            >
                <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: '800' }}>
                    <MessageCircle size={32} color="var(--primary-orange)" /> Get in Touch
                </h1>
                <p style={{ margin: '2rem 0', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Have questions or feedback? Our team is here to help you navigate your career journey.
                </p>
                <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <p style={{ marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Email us at:</p>
                    <a href="mailto:support@career.co" style={{ color: 'var(--primary-orange)', textDecoration: 'none', fontSize: '1.2rem', fontWeight: '700' }}>
                        support@career.co
                    </a>
                </div>
                <button className="btn-primary" style={{ marginTop: '2rem', padding: '1rem 2.5rem' }}>Send a Message</button>
            </motion.div>
        </div>
    );
};

export default Contact;
