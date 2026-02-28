# Client Website Integration Guide

This guide shows how to integrate the lead magnet backend with your client's website.

## Overview

Your client's website will:
1. Display a lead capture form
2. Submit form data to your backend API
3. Show success/error messages
4. Optionally redirect or display thank you message

## Basic HTML/JavaScript Integration

### Simple Form Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Free Guide Download</title>
    <style>
        .form-container {
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            width: 100%;
            padding: 12px;
            background: #0070f3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #0051cc;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .message {
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>Download Your Free Guide</h2>
        <p>Enter your details to receive instant access.</p>
        
        <div id="message"></div>
        
        <form id="leadForm">
            <div class="form-group">
                <label for="name">Full Name *</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email Address *</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <button type="submit" id="submitBtn">
                Get Instant Access
            </button>
        </form>
    </div>

    <script>
        const API_URL = 'https://your-backend.com/api/leads';
        const API_KEY = 'your-api-key';
        
        document.getElementById('leadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const messageDiv = document.getElementById('message');
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            messageDiv.innerHTML = '';
            
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        source: 'landing-page',
                        metadata: {
                            page: window.location.pathname,
                            referrer: document.referrer,
                        }
                    }),
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Success!
                    messageDiv.innerHTML = `
                        <div class="message success">
                            ✓ Success! Check your email for the download link.
                        </div>
                    `;
                    
                    // Reset form
                    document.getElementById('leadForm').reset();
                    
                    // Optional: Redirect to thank you page
                    // setTimeout(() => {
                    //     window.location.href = '/thank-you';
                    // }, 2000);
                    
                } else {
                    throw new Error(data.error || 'Submission failed');
                }
                
            } catch (error) {
                messageDiv.innerHTML = `
                    <div class="message error">
                        ✗ ${error.message}. Please try again.
                    </div>
                `;
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Get Instant Access';
            }
        });
    </script>
</body>
</html>
```

## React Integration

### React Component Example

```jsx
import { useState } from 'react';

const API_URL = 'https://your-backend.com/api/leads';
const API_KEY = 'your-api-key';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({
          ...formData,
          source: 'react-app',
          metadata: {
            page: window.location.pathname,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Check your email for the download link!');
        setFormData({ name: '', email: '' });
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Download Your Free Guide</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${
          status === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {status === 'loading' ? 'Submitting...' : 'Get Instant Access'}
        </button>
      </form>
    </div>
  );
}
```

## WordPress Integration

### Using Contact Form 7

1. Install Contact Form 7 plugin
2. Create new form with name and email fields
3. Add this code to your theme's `functions.php`:

```php
<?php
add_action('wpcf7_before_send_mail', 'submit_to_lead_backend');

function submit_to_lead_backend($contact_form) {
    $submission = WPCF7_Submission::get_instance();
    
    if ($submission) {
        $posted_data = $submission->get_posted_data();
        
        $data = array(
            'name' => $posted_data['your-name'],
            'email' => $posted_data['your-email'],
            'source' => 'wordpress-cf7',
        );
        
        $args = array(
            'body' => json_encode($data),
            'headers' => array(
                'Content-Type' => 'application/json',
                'x-api-key' => 'your-api-key',
            ),
            'method' => 'POST',
            'timeout' => 30,
        );
        
        wp_remote_post('https://your-backend.com/api/leads', $args);
    }
}
?>
```

## Next.js Integration

### Server Action Example

```typescript
// app/actions.ts
'use server';

const API_URL = 'https://your-backend.com/api/leads';
const API_KEY = process.env.LEAD_API_KEY!;

export async function submitLead(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        name,
        email,
        source: 'nextjs-app',
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit' 
    };
  }
}
```

```tsx
// app/components/LeadForm.tsx
'use client';

import { submitLead } from '../actions';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Get Instant Access'}
    </button>
  );
}

export default function LeadForm() {
  return (
    <form action={submitLead}>
      <input name="name" type="text" required />
      <input name="email" type="email" required />
      <SubmitButton />
    </form>
  );
}
```

## Advanced Features

### Track Source/Campaign

```javascript
// Add UTM parameters or source tracking
const urlParams = new URLSearchParams(window.location.search);

const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  body: JSON.stringify({
    name: name,
    email: email,
    source: 'landing-page',
    metadata: {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      referrer: document.referrer,
      page: window.location.pathname,
    }
  }),
});
```

### Add Phone Number Field

```javascript
// In your form
<input type="tel" id="phone" name="phone">

// In your submission
body: JSON.stringify({
  name: name,
  email: email,
  source: 'landing-page',
  metadata: {
    phone: document.getElementById('phone').value,
  }
}),
```

### Google Analytics Tracking

```javascript
// After successful submission
if (data.success && typeof gtag !== 'undefined') {
  gtag('event', 'lead_submission', {
    'event_category': 'Lead',
    'event_label': 'Landing Page Form',
  });
}
```

## Testing Integration

### Test Checklist

- [ ] Form submits successfully
- [ ] Success message displays
- [ ] Email validation works
- [ ] Required fields are enforced
- [ ] Error messages show for failures
- [ ] Lead appears in admin dashboard
- [ ] CORS is configured correctly
- [ ] API key is working
- [ ] Mobile responsive
- [ ] Loading states work

### Test with cURL

```bash
curl -X POST https://your-backend.com/api/leads \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "source": "test"
  }'
```

## Common Issues

### CORS Error
**Problem**: "Access to fetch has been blocked by CORS policy"

**Solution**: Add client domain to `CLIENT_ALLOWED_ORIGIN` in backend `.env`

### 403 Forbidden
**Problem**: API returns 403 error

**Solution**: Check `x-api-key` header matches `CLIENT_API_KEY` in backend

### Network Error
**Problem**: Request fails with network error

**Solution**: 
- Check API URL is correct
- Verify backend is deployed and running
- Test with `/api/health` endpoint first

## Security Best Practices

1. **Never expose API key in client code** - Use environment variables
2. **Validate on backend** - Don't trust client-side validation alone
3. **Rate limiting** - Consider adding rate limiting for production
4. **HTTPS only** - Always use HTTPS in production
5. **Sanitize inputs** - Backend already handles this

## Need Help?

- Check backend is running: `https://your-backend.com/api/health`
- Review browser console for errors
- Check backend logs in deployment platform
- Verify environment variables are set correctly

---

**Ready to integrate?** Choose the example that matches your client's tech stack and customize as needed!
