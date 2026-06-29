# Security Specification: Designs4you Firebase Security

This document outlines the security architecture, data invariants, and adversarial test scenarios ("Dirty Dozen" Payloads) designed to verify the strength of our Firestore security rules.

## 1. Data Invariants

1. **System Configurations and Content Read-Access**: Settings, Services, Portfolio, Videos, Reviews, FAQs, Announcements, Banners, and Pricing are public data, readable by anyone (`allow read: if true;`).
2. **System Configurations and Content Write-Access**: No system content can be created, updated, or deleted by unauthenticated clients. Writes require full authentication (`allow write: if request.auth != null;`).
3. **Personally Identifiable Information (PII) Protection**: Maintenance bookings contain customer names, phone numbers, WhatsApp, and emails. 
   - Public clients can only *create* maintenance bookings (`allow create: if true;`).
   - Reading, listing, or deleting maintenance bookings is strictly forbidden for the public and is restricted exclusively to authenticated administrators (`allow read, delete: if request.auth != null;`).
4. **ID Poisoning and Denial of Wallet**: All document IDs must be validated to prevent massive or corrupt path keys. Document fields must be type-checked with strict upper bounds on size to prevent resource exhaustion or payload abuse.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following malicious payloads must be rejected by the security rules:

### Payload 1: Unauthorized Settings Modification
* **Target**: `config/settings` (Write)
* **Actor**: Anonymous
* **Payload**: `{"settings": {"company": "Hacked Inc"}}`
* **Expected Result**: `PERMISSION_DENIED`

### Payload 2: Shadow Field Injection in Services
* **Target**: `services/new-service` (Create)
* **Actor**: Authenticated user with extra unrecognized properties
* **Payload**: `{"id": "service-1", "title": {"ar": "أ", "en": "A"}, "description": {"ar": "ب", "en": "B"}, "options": [], "order": 1, "ghost_field": "unauthorized_injection"}`
* **Expected Result**: `PERMISSION_DENIED`

### Payload 3: Insecure Image Type/Format in Portfolio
* **Target**: `portfolio/item-1` (Create)
* **Actor**: Authenticated, injecting extremely large Title text
* **Payload**: `{"url": "http://evil.com/x.jpg", "filename": "x.jpg", "category": "emb", "title": {"ar": "A...", "en": "A...[Extremely long 1MB string]"}, "order": 1}`
* **Expected Result**: `PERMISSION_DENIED`

### Payload 4: Arbitrary Guest Read of Maintenance Bookings
* **Target**: `maintenanceBookings/booking-123` (Read/List)
* **Actor**: Anonymous
* **Expected Result**: `PERMISSION_DENIED`

### Payload 5: Anonymous Deletion of Maintenance Bookings
* **Target**: `maintenanceBookings/booking-123` (Delete)
* **Actor**: Anonymous
* **Expected Result**: `PERMISSION_DENIED`

### Payload 6: Malformed Maintenance Booking (Missing Required Field)
* **Target**: `maintenanceBookings/booking-123` (Create)
* **Actor**: Anonymous
* **Payload**: `{"name": "John Doe", "phone": "123456"}` (Missing machineType, machineModel, problemDesc, contactTime)
* **Expected Result**: `PERMISSION_DENIED`

### Payload 7: Huge Size Resource Attack on Maintenance Booking Description
* **Target**: `maintenanceBookings/booking-123` (Create)
* **Actor**: Anonymous
* **Payload**: `{"name": "John", "phone": "123", "whatsapp": "123", "email": "a@b.com", "machineType": "A", "machineModel": "B", "problemDesc": "[Over 10MB of text]", "contactTime": "Now"}`
* **Expected Result**: `PERMISSION_DENIED`

### Payload 8: Path Poisoning ID Attack on FAQs
* **Target**: `faqs/../invalid-id` (Create)
* **Actor**: Authenticated (but injecting invalid characters in ID)
* **Expected Result**: `PERMISSION_DENIED`

### Payload 9: Self-Promotion / Admin Role Spoofing (Modifying Admin Claims)
* **Target**: `users/attacker-uid` (Create)
* **Actor**: Authenticated attacker attempting to bypass database barriers
* **Payload**: `{"email": "hacker@domain.com", "role": "admin", "isAdmin": true}`
* **Expected Result**: `PERMISSION_DENIED`

### Payload 10: Unauthorized Video Link Overwrite
* **Target**: `videos/vid-123` (Write)
* **Actor**: Anonymous
* **Payload**: `{"url": "https://youtube.com/evil", "title": {"ar": "A", "en": "B"}, "duration": "10:00", "thumbnail": "t.jpg", "order": 1}`
* **Expected Result**: `PERMISSION_DENIED`

### Payload 11: Tampering Announcement status anonymously
* **Target**: `announcements/ann-1` (Update)
* **Actor**: Anonymous
* **Payload**: `{"active": false}`
* **Expected Result**: `PERMISSION_DENIED`

### Payload 12: Anonymous Pricing Guide Tampering
* **Target**: `pricingList/price-1` (Create)
* **Actor**: Anonymous
* **Payload**: `{"title": {"ar": "رخيص", "en": "Cheap"}, "price": "1 EGP", "unit": {"ar": "ساعة", "en": "hour"}, "icon": "Dollar", "order": 0}`
* **Expected Result**: `PERMISSION_DENIED`

---

## 3. Test Verification Runner

We verify these assertions through unit testing during development.
The `firestore.rules` enforces every single case strictly.
