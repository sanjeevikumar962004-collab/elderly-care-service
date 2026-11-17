/**
 * Stackly Salem Healthcare & Nursing — Global Form Validation & Navigation Core
 * Features:
 * 1. Universal Dynamic CSS Injection (.is-valid, .is-invalid, .validation-error-msg, shake, toasts)
 * 2. Unified Global Toast System (window.showGlobalToast, window.showToast)
 * 3. Standard Regex Patterns (email, phone 10-digit, name letters)
 * 4. Input Character Constraints (strict 10-digit phone, clean alphabetic names)
 * 5. Full Auth Form Validations (window.validateLoginForm, window.validateSignupForm) - strictly preserving auth requirements
 * 6. Public Forms Validation (Contact Form #care-inquiry-form, Newsletter #newsletter-form)
 * 7. Dashboard Forms Validation (Admin Store Settings, Admin Profile, User Booking, Measurements/Vitals, User Profile, Password)
 * 8. Live Real-Time Validation on blur & input for all forms sitewide
 * 9. Global 404 Routing for dead links/unused buttons on public pages (STRICT: Dashboards never redirect to 404)
 */

(function () {
    // ── 1. DYNAMIC CSS STYLES INJECTION ──
    const style = document.createElement('style');
    style.id = 'stackly-validation-styles';
    style.textContent = `
        /* Live Validation Visual Feedback */
        input.is-valid,
        select.is-valid,
        textarea.is-valid {
            border-color: #10b981 !important;
            background-color: #f0fdf4 !important;
            box-shadow: 0 0 0 1px #10b981 !important;
        }

        input.is-invalid,
        select.is-invalid,
        textarea.is-invalid {
            border-color: #ef4444 !important;
            background-color: #fffbfa !important;
            box-shadow: 0 0 0 1.5px #ef4444 !important;
        }

        /* Inline Error Labels */
        .validation-error-msg {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            font-weight: 600;
            color: #dc2626;
            margin-top: 4px;
            line-height: 1.35;
            animation: errorFadeIn 0.25s ease-out forwards;
        }
        .validation-error-msg::before {
            content: "⚠";
            font-size: 11px;
            font-weight: 700;
        }

        @keyframes errorFadeIn {
            from { opacity: 0; transform: translateY(-3px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Field Shake Animation */
        @keyframes fieldShakeAnim {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        .is-invalid-shake {
            animation: fieldShakeAnim 0.35s ease-in-out !important;
        }

        /* Universal Toast Container & Elements */
        #stackly-universal-toast-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
            max-width: calc(100vw - 32px);
        }
        @media (max-width: 640px) {
            #stackly-universal-toast-container {
                right: 16px;
                left: 16px;
                bottom: 16px;
                align-items: center;
            }
        }
        .stackly-toast-bubble {
            pointer-events: all;
            min-width: 280px;
            max-width: 420px;
            padding: 12px 18px;
            background: #0f172a;
            color: #ffffff;
            border-radius: 14px;
            font-family: inherit;
            box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.35);
            display: flex;
            align-items: flex-start;
            gap: 12px;
            border-left: 4px solid #0043b1;
            opacity: 0;
            transform: translateY(16px) scale(0.96);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stackly-toast-bubble.show {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        .stackly-toast-bubble.success {
            border-left-color: #10b981;
        }
        .stackly-toast-bubble.error {
            border-left-color: #ef4444;
        }
        .stackly-toast-bubble.info {
            border-left-color: #0043b1;
        }
        .stackly-toast-bubble .toast-title {
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 2px;
            line-height: 1.25;
        }
        .stackly-toast-bubble .toast-body {
            font-size: 11.5px;
            color: #94a3b8;
            font-weight: 500;
            line-height: 1.4;
        }
    `;
    if (!document.getElementById('stackly-validation-styles')) {
        document.head.appendChild(style);
    }
})();

// ── 2. GLOBAL REGEX PATTERNS ──
window.emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
window.phonePattern = /^[0-9]{10}$/;
window.namePattern = /^[a-zA-Z\s.'-]+$/;

// ── 3. UNIFIED GLOBAL TOAST SYSTEM ──
window.showGlobalToast = function (title, message, type = 'info') {
    // If the host page has its own custom showToast (like in admin or user dashboard), try calling it
    const existingContainer = document.getElementById('toast-container');
    if (existingContainer && typeof window.showToast === 'function' && window.showToast !== window.showGlobalToast) {
        window.showToast(title, message, type);
        return;
    }

    let container = document.getElementById('stackly-universal-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'stackly-universal-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `stackly-toast-bubble ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    else if (type === 'error') icon = '⚠';

    toast.innerHTML = `
        <div style="font-size:15px;line-height:1;margin-top:1px;font-weight:bold;color:${type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#60a5fa')}">${icon}</div>
        <div style="flex:1;">
            <div class="toast-title">${title}</div>
            <div class="toast-body">${message}</div>
        </div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
};

// Fallback alias if page calls showToast directly
if (!window.showToast) {
    window.showToast = window.showGlobalToast;
}

// ── 4. HELPER: FIELD VALIDATION VISUAL FEEDBACK ──
window.showFieldValidation = function (inputEl, isValid, errorMsg = '') {
    if (!inputEl) return;
    
    // Locate the container in which to place error message
    const wrapper = inputEl.closest('.relative') || inputEl.parentElement;
    let targetContainer = wrapper;
    if (wrapper && wrapper.classList.contains('relative') && wrapper.parentElement) {
        targetContainer = wrapper.parentElement;
    }

    let existingMsg = targetContainer ? targetContainer.querySelector('.validation-error-msg') : null;

    if (isValid) {
        inputEl.classList.remove('is-invalid');
        inputEl.classList.add('is-valid');
        if (existingMsg) {
            existingMsg.remove();
        }
    } else {
        inputEl.classList.remove('is-valid');
        inputEl.classList.add('is-invalid');
        if (!existingMsg && targetContainer) {
            existingMsg = document.createElement('span');
            existingMsg.className = 'validation-error-msg';
            targetContainer.appendChild(existingMsg);
        }
        if (existingMsg) {
            existingMsg.textContent = errorMsg || 'Please provide a valid entry.';
        }
    }
};

window.clearFieldValidation = function (inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove('is-valid', 'is-invalid');
    const wrapper = inputEl.closest('.relative') || inputEl.parentElement;
    let targetContainer = wrapper;
    if (wrapper && wrapper.classList.contains('relative') && wrapper.parentElement) {
        targetContainer = wrapper.parentElement;
    }
    if (targetContainer) {
        const msg = targetContainer.querySelector('.validation-error-msg');
        if (msg) msg.remove();
    }
};

// ── 5. AUTH VALIDATION (login.html & signup.html) ──
// Strictly preserves auth requirements, sets session, and routes to respective dashboard

window.validateLoginForm = function (event) {
    if (event) event.preventDefault();

    const emailEl = document.getElementById('login-email');
    const passwordEl = document.getElementById('login-password');
    const roleInput = document.getElementById('login-role');

    const email = emailEl ? emailEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value : '';
    const role = (roleInput && roleInput.value === 'admin') ? 'admin' : 'user';
    const isUser = (role === 'user');
    const roleTitle = isUser ? 'Patient & Family' : 'Clinical Administrator';

    let hasError = false;

    // Email validation
    if (!email) {
        window.showFieldValidation(emailEl, false, 'Please enter your registered email address.');
        hasError = true;
    } else if (!window.emailPattern.test(email) || email.length < 5) {
        window.showFieldValidation(emailEl, false, 'Please enter a valid email format (e.g. family@stacklycare.in).');
        hasError = true;
    } else {
        window.showFieldValidation(emailEl, true);
    }

    // Password validation (min 6 characters)
    if (!password) {
        window.showFieldValidation(passwordEl, false, 'Please enter your security password.');
        hasError = true;
    } else if (password.length < 6) {
        window.showFieldValidation(passwordEl, false, 'Password must be at least 6 characters long.');
        hasError = true;
    } else {
        window.showFieldValidation(passwordEl, true);
    }

    if (hasError) {
        const form = document.getElementById('login-form');
        if (form) {
            form.classList.add('is-invalid-shake');
            setTimeout(() => form.classList.remove('is-invalid-shake'), 400);
        }
        window.showGlobalToast('Login Error', 'Please correct the highlighted errors before submitting.', 'error');
        if (emailEl && emailEl.classList.contains('is-invalid')) emailEl.focus();
        else if (passwordEl) passwordEl.focus();
        return false;
    }

    // Authenticate and redirect
    const btn = document.getElementById('login-submit-btn');
    if (btn) {
        btn.innerHTML = `<span>Authenticating Credentials…</span>`;
        btn.disabled = true;
    }

    setTimeout(() => {
        const userName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const authObj = {
            email: email,
            name: `${fname} ${lname}`,
            role: roleTitle,
            roleKey: role,
            loginTime: new Date().toISOString()
        };
        sessionStorage.setItem('stackly_auth', JSON.stringify(authObj));
        localStorage.setItem('stackly_auth', JSON.stringify(authObj));

        const savedRedirect = sessionStorage.getItem('stackly_redirect');
        sessionStorage.removeItem('stackly_redirect');
        const targetUrl = (savedRedirect && ((role === 'admin' && savedRedirect.includes('admin')) || (role === 'user' && savedRedirect.includes('user'))))
            ? savedRedirect
            : (isUser ? 'user-dashboard.html' : 'admin.html');

        window.showGlobalToast('Welcome Back', `Authenticated as ${roleTitle}. Redirecting to portal…`, 'success');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 850);
    }, 950);

    return true;
};

window.validateSignupForm = function (event) {
    if (event) event.preventDefault();

    const fnameEl = document.getElementById('signup-fname');
    const lnameEl = document.getElementById('signup-lname');
    const emailEl = document.getElementById('signup-email');
    const passwordEl = document.getElementById('signup-password');
    const confirmEl = document.getElementById('signup-confirm');
    const termsEl = document.getElementById('signup-terms');
    const roleInput = document.getElementById('signup-role');

    const fname = fnameEl ? fnameEl.value.trim() : '';
    const lname = lnameEl ? lnameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value : '';
    const confirm = confirmEl ? confirmEl.value : '';
    const terms = termsEl ? termsEl.checked : false;
    const role = (roleInput && roleInput.value === 'admin') ? 'admin' : 'user';
    const isUser = (role === 'user');
    const roleTitle = isUser ? 'Patient & Family' : 'Clinical Administrator';

    let hasError = false;

    // First Name
    if (!fname || fname.length < 2) {
        window.showFieldValidation(fnameEl, false, 'First name must be at least 2 characters.');
        hasError = true;
    } else if (!window.namePattern.test(fname)) {
        window.showFieldValidation(fnameEl, false, 'First name should contain letters only.');
        hasError = true;
    } else {
        window.showFieldValidation(fnameEl, true);
    }

    // Last Name
    if (!lname || lname.length < 1) {
        window.showFieldValidation(lnameEl, false, 'Please enter your last name.');
        hasError = true;
    } else if (!window.namePattern.test(lname)) {
        window.showFieldValidation(lnameEl, false, 'Last name should contain letters only.');
        hasError = true;
    } else {
        window.showFieldValidation(lnameEl, true);
    }

    // Email
    if (!email || !window.emailPattern.test(email) || email.length < 5) {
        window.showFieldValidation(emailEl, false, 'Please enter a valid email address.');
        hasError = true;
    } else {
        window.showFieldValidation(emailEl, true);
    }

    // Password (min 8 chars)
    if (!password || password.length < 8) {
        window.showFieldValidation(passwordEl, false, 'Password must contain at least 8 characters.');
        hasError = true;
    } else {
        window.showFieldValidation(passwordEl, true);
    }

    // Confirm password
    if (!confirm || password !== confirm) {
        window.showFieldValidation(confirmEl, false, 'Passwords do not match.');
        hasError = true;
    } else {
        window.showFieldValidation(confirmEl, true);
    }

    // Terms
    if (!terms) {
        window.showGlobalToast('Validation Error', 'You must agree to the Patient Care Protocols & Privacy Policy.', 'error');
        if (termsEl) termsEl.focus();
        hasError = true;
    }

    if (hasError) {
        const form = document.getElementById('signup-form');
        if (form) {
            form.classList.add('is-invalid-shake');
            setTimeout(() => form.classList.remove('is-invalid-shake'), 400);
        }
        return false;
    }

    const btn = document.getElementById('signup-submit-btn');
    if (btn) {
        btn.innerHTML = `<span>Creating Care Account…</span>`;
        btn.disabled = true;
    }

    setTimeout(() => {
        const authObj = {
            email: email,
            name: `${fname} ${lname}`,
            role: roleTitle,
            roleKey: role,
            loginTime: new Date().toISOString()
        };
        sessionStorage.setItem('stackly_auth', JSON.stringify(authObj));
        localStorage.setItem('stackly_auth', JSON.stringify(authObj));

        const targetUrl = isUser ? 'user-dashboard.html' : 'admin.html';
        window.showGlobalToast('Account Created ✓', `Welcome to Salem Elderly Care, ${fname}! Loading your portal…`, 'success');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 900);
    }, 1000);

    return true;
};

// ── 6. CONTACT PAGE FORM VALIDATION (contact.html) ──
window.handleConsultationSubmit = function () {
    const form = document.getElementById('care-inquiry-form');
    if (!form) return false;

    const patientNameEl = document.getElementById('patient_name');
    const contactNameEl = document.getElementById('contact_name');
    const phoneEl = document.getElementById('phone');
    const localityEl = document.getElementById('locality');
    const careTypeEl = document.getElementById('care_type');
    const durationEl = document.getElementById('duration');
    const notesEl = document.getElementById('medical_notes');
    const banner = document.getElementById('form-success-banner');

    const patientName = patientNameEl ? patientNameEl.value.trim() : '';
    const contactName = contactNameEl ? contactNameEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim().replace(/[^0-9]/g, '') : '';
    const locality = localityEl ? localityEl.value : '';
    const careType = careTypeEl ? careTypeEl.value : '';
    const duration = durationEl ? durationEl.value : '';
    const notes = notesEl ? notesEl.value.trim() : '';

    let hasError = false;

    // Patient Name
    if (!patientName || patientName.length < 2) {
        window.showFieldValidation(patientNameEl, false, 'Patient full name is required (minimum 2 letters).');
        hasError = true;
    } else if (!window.namePattern.test(patientName)) {
        window.showFieldValidation(patientNameEl, false, 'Patient name should contain letters and spaces only.');
        hasError = true;
    } else {
        window.showFieldValidation(patientNameEl, true);
    }

    // Contact Name
    if (!contactName || contactName.length < 2) {
        window.showFieldValidation(contactNameEl, false, 'Primary family contact name is required.');
        hasError = true;
    } else if (!window.namePattern.test(contactName)) {
        window.showFieldValidation(contactNameEl, false, 'Contact name should contain letters only.');
        hasError = true;
    } else {
        window.showFieldValidation(contactNameEl, true);
    }

    // Contact Phone
    if (!phone || phone.length !== 10) {
        window.showFieldValidation(phoneEl, false, 'Phone number must be exactly 10 digits (e.g. 9876543210).');
        hasError = true;
    } else {
        window.showFieldValidation(phoneEl, true);
    }

    // Locality
    if (!locality) {
        window.showFieldValidation(localityEl, false, 'Please select a Salem locality or ward.');
        hasError = true;
    } else {
        window.showFieldValidation(localityEl, true);
    }

    // Care Type
    if (!careType) {
        window.showFieldValidation(careTypeEl, false, 'Please select the required clinical care service.');
        hasError = true;
    } else {
        window.showFieldValidation(careTypeEl, true);
    }

    // Duration
    if (!duration) {
        window.showFieldValidation(durationEl, false, 'Please select desired care coverage / shift.');
        hasError = true;
    } else {
        window.showFieldValidation(durationEl, true);
    }

    // Medical Notes (optional, but if provided must be min 10 chars)
    if (notes && notes.length > 0 && notes.length < 10) {
        window.showFieldValidation(notesEl, false, 'Please provide at least 10 characters describing the patient condition.');
        hasError = true;
    } else if (notes) {
        window.showFieldValidation(notesEl, true);
    }

    if (hasError) {
        form.classList.add('is-invalid-shake');
        setTimeout(() => form.classList.remove('is-invalid-shake'), 400);
        window.showGlobalToast('Validation Error', 'Please complete all required fields correctly before submitting.', 'error');
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return false;
    }

    // Success dispatch
    window.showGlobalToast('Consultation Dispatched ✓', `Assessment request confirmed for ${patientName}. Care coordinator will call within 15 minutes.`, 'success');

    if (banner) {
        banner.classList.remove('hidden');
        banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Disable inputs to avoid double submission
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].type !== 'button') {
            elements[i].disabled = true;
        }
    }
    return true;
};

// ── 7. BLOG NEWSLETTER FORM VALIDATION (blog.html) ──
window.validateNewsletterForm = function (form) {
    if (!form) return false;
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput) return false;

    const val = emailInput.value.trim();
    if (!val || !window.emailPattern.test(val)) {
        window.showFieldValidation(emailInput, false, 'Please enter a valid email address (e.g. name@domain.com).');
        form.classList.add('is-invalid-shake');
        setTimeout(() => form.classList.remove('is-invalid-shake'), 400);
        window.showGlobalToast('Validation Error', 'Please enter a valid email address.', 'error');
        emailInput.focus();
        return false;
    }

    window.showFieldValidation(emailInput, true);
    const successDiv = document.getElementById('newsletter-success');
    if (successDiv) {
        successDiv.classList.remove('hidden');
    }
    form.classList.add('hidden');
    window.showGlobalToast('Digest Subscribed ✓', 'Thank you for subscribing to Stackly Salem Care Digest!', 'success');
    return true;
};

// ── 8. LIVE VALIDATION ATTACHMENTS ──
document.addEventListener('DOMContentLoaded', () => {
    // 1. Phone constraints: strictly 10 digits
    const bindPhoneConstraints = () => {
        document.querySelectorAll('input[type="tel"], input#phone, input#contact-phone, input#store-phone-val, input#user-set-phone').forEach(inp => {
            inp.setAttribute('maxlength', '10');
            inp.setAttribute('inputmode', 'numeric');
            inp.addEventListener('input', (e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                if (e.target.value !== cleaned) {
                    e.target.value = cleaned;
                }
                if (cleaned.length === 10) {
                    window.showFieldValidation(e.target, true);
                } else if (e.target.classList.contains('is-invalid') || e.target.classList.contains('is-valid')) {
                    window.showFieldValidation(e.target, false, 'Phone number must be exactly 10 digits.');
                }
            });
            inp.addEventListener('blur', (e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '');
                if (e.target.hasAttribute('required') || cleaned.length > 0) {
                    if (cleaned.length !== 10) {
                        window.showFieldValidation(e.target, false, 'Phone number must be exactly 10 digits.');
                    } else {
                        window.showFieldValidation(e.target, true);
                    }
                }
            });
        });
    };
    bindPhoneConstraints();

    // 2. Name inputs constraint & live validation
    const nameInputs = document.querySelectorAll(
        '#patient_name, #contact_name, #signup-fname, #signup-lname, #settings-name, #user-set-name'
    );
    nameInputs.forEach(inp => {
        inp.addEventListener('input', (e) => {
            const cleaned = e.target.value.replace(/[^a-zA-Z\s.'-]/g, '');
            if (e.target.value !== cleaned) {
                e.target.value = cleaned;
            }
            if (e.target.classList.contains('is-invalid') || e.target.classList.contains('is-valid')) {
                if (cleaned.trim().length >= 2) {
                    window.showFieldValidation(e.target, true);
                } else {
                    window.showFieldValidation(e.target, false, 'Must be at least 2 characters.');
                }
            }
        });
        inp.addEventListener('blur', (e) => {
            const val = e.target.value.trim();
            if (e.target.hasAttribute('required') || val.length > 0) {
                if (val.length < 2) {
                    window.showFieldValidation(e.target, false, 'Must be at least 2 characters.');
                } else if (!window.namePattern.test(val)) {
                    window.showFieldValidation(e.target, false, 'Contains invalid characters.');
                } else {
                    window.showFieldValidation(e.target, true);
                }
            }
        });
    });

    // 3. Email inputs live validation
    const emailInputs = document.querySelectorAll(
        'input[type="email"], #login-email, #signup-email, #store-email-val, #settings-email, #user-set-email'
    );
    emailInputs.forEach(inp => {
        inp.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (e.target.classList.contains('is-invalid') || e.target.classList.contains('is-valid')) {
                if (window.emailPattern.test(val)) {
                    window.showFieldValidation(e.target, true);
                } else {
                    window.showFieldValidation(e.target, false, 'Invalid email format.');
                }
            }
        });
        inp.addEventListener('blur', (e) => {
            const val = e.target.value.trim();
            if (e.target.hasAttribute('required') || val.length > 0) {
                if (!window.emailPattern.test(val)) {
                    window.showFieldValidation(e.target, false, 'Please enter a valid email address.');
                } else {
                    window.showFieldValidation(e.target, true);
                }
            }
        });
    });

    // 4. Password inputs live validation
    const pwInputs = document.querySelectorAll(
        '#login-password, #signup-password, #settings-new-pw, #user-new-pw, #user-old-pw'
    );
    pwInputs.forEach(inp => {
        inp.addEventListener('blur', (e) => {
            const val = e.target.value;
            const minLen = (inp.id === 'login-password' || inp.id === 'user-old-pw') ? 6 : 8;
            if (inp.hasAttribute('required') || val.length > 0) {
                if (val.length < minLen) {
                    window.showFieldValidation(e.target, false, `Password must be at least ${minLen} characters.`);
                } else {
                    window.showFieldValidation(e.target, true);
                }
            }
        });
    });

    // 5. Password confirmation live validation
    const confirmInputs = [
        { orig: document.getElementById('signup-password'), conf: document.getElementById('signup-confirm') },
        { orig: document.getElementById('settings-new-pw'), conf: document.getElementById('settings-confirm-pw') },
        { orig: document.getElementById('user-new-pw'), conf: document.getElementById('user-confirm-pw') }
    ];
    confirmInputs.forEach(pair => {
        if (pair.orig && pair.conf) {
            pair.conf.addEventListener('input', () => {
                if (pair.conf.value.length > 0) {
                    if (pair.conf.value !== pair.orig.value) {
                        window.showFieldValidation(pair.conf, false, 'Passwords do not match.');
                    } else {
                        window.showFieldValidation(pair.conf, true);
                    }
                }
            });
            pair.conf.addEventListener('blur', () => {
                if (pair.conf.hasAttribute('required') || pair.conf.value.length > 0) {
                    if (pair.conf.value !== pair.orig.value) {
                        window.showFieldValidation(pair.conf, false, 'Passwords do not match.');
                    } else {
                        window.showFieldValidation(pair.conf, true);
                    }
                }
            });
        }
    });

    // 6. Select inputs live validation (contact form)
    document.querySelectorAll('#locality, #care_type, #duration').forEach(sel => {
        sel.addEventListener('change', (e) => {
            if (e.target.value) {
                window.showFieldValidation(e.target, true);
            } else {
                window.showFieldValidation(e.target, false, 'Please select an option.');
            }
        });
    });

    // 7. Blog newsletter form attachment
    const blogNewsletter = document.getElementById('newsletter-form');
    if (blogNewsletter) {
        blogNewsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            window.validateNewsletterForm(blogNewsletter);
        });
    }
});

// ── 9. GLOBAL CLICK-TO-404 NAVIGATOR ──
// Strictly preserves dashboard internal navigation; routes only dead links on public pages
document.addEventListener('click', (e) => {
    const isDashboard = window.location.pathname.includes('admin.html') || window.location.pathname.includes('user-dashboard.html');

    // In dashboards, completely ignore 404 redirections
    if (isDashboard) {
        const a = e.target.closest('a');
        if (a) {
            const href = a.getAttribute('href');
            if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
                e.preventDefault();
                return;
            }
        }
        return;
    }

    // 1. Check Unused / Placeholder Buttons on Public Pages
    const btn = e.target.closest('button');
    if (btn) {
        // Explicit 404 button
        if (btn.getAttribute('data-action') === '404') {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '404.html';
            return;
        }

        // Functional buttons to preserve:
        const isMenuToggle = btn.id === 'mobile-nav-toggle' || btn.closest('#mobile-nav-toggle') !== null;
        const isTestimonial = btn.classList.contains('testimonial-btn') || btn.classList.contains('avatar-btn') || btn.hasAttribute('data-index');
        const isAccordion = btn.classList.contains('accordion-trigger') || (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('toggleAccordion'));
        const isRoleTab = btn.id && (btn.id.startsWith('role-tab-') || btn.id.startsWith('signup-tab-'));
        const isDemoBtn = btn.getAttribute('onclick') && (btn.getAttribute('onclick').includes('fillDemo') || btn.getAttribute('onclick').includes('setLoginRole') || btn.getAttribute('onclick').includes('setSignupRole') || btn.getAttribute('onclick').includes('setTestimonial'));
        const isModalControl = btn.getAttribute('onclick') && (btn.getAttribute('onclick').includes('modal') || btn.getAttribute('onclick').includes('close'));
        const isFormSubmit = btn.type === 'submit' || (btn.closest('form') && btn.type !== 'button');

        const isFunctional = isMenuToggle || isTestimonial || isAccordion || isRoleTab || isDemoBtn || isModalControl || isFormSubmit;

        if (!isFunctional) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '404.html';
            return;
        }
    }

    // 2. Unused / placeholder anchor tags on PUBLIC pages (#, empty, javascript:void(0))
    const a = e.target.closest('a');
    if (a) {
        const href = a.getAttribute('href');
        if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;' || a.getAttribute('data-action') === '404') {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '404.html';
            return;
        }
    }
});
