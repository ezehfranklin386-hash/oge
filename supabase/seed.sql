-- ============================================================
-- G Interior — Seed Data
-- Run ONCE after the migration AND after creating the admin
-- auth user (admin@ginterior.ng) in the Supabase dashboard.
-- Idempotent: every insert uses ON CONFLICT DO NOTHING.
-- ============================================================

-- ── Grant admin rights ──────────────────────────────────────
-- The auth user must already exist in auth.users.
insert into public.admins (user_id, email)
select id, email from auth.users
where lower(email) = 'admin@ginterior.ng'
on conflict (user_id) do nothing;

-- ── Site settings singleton ─────────────────────────────────
insert into public.site_settings (
  id, phone, phone_raw, phone2, phone2_raw,
  whatsapp, whatsapp_raw, email, address, address_full,
  instagram, facebook, twitter, linkedin, tiktok
)
values (
  'main',
  '+234 801 234 5678', '2348012345678',
  '+234 802 345 6789', '2348023456789',
  '+234 801 234 5678', '2348012345678',
  'hello@ginterior.ng',
  'Lagos, Nigeria',
  '12 Adeola Odeku Street, Victoria Island, Lagos, Nigeria',
  'https://instagram.com/ginterior',
  'https://facebook.com/ginterior',
  'https://twitter.com/ginterior',
  'https://linkedin.com/company/ginterior',
  'https://tiktok.com/@ginterior'
)
on conflict (id) do nothing;

-- ── Agents (fixed UUIDs so re-runs are idempotent) ──────────
insert into public.agents (id, name, role, phone, whatsapp, email, photo_url, bio, active)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'Adaeze Obi',
    'Senior Property Consultant',
    '+234 801 234 5678',
    '+234 801 234 5678',
    'adaeze.obi@ginterior.ng',
    '/brand/logo.jpeg',
    'Adaeze brings over 8 years of luxury real estate experience in Lagos Island and Mainland. She specialises in high-value residential sales and has an unmatched network of buyers and sellers.',
    true
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'Chidi Eze',
    'Leasing & Commercial Specialist',
    '+234 802 345 6789',
    '+234 802 345 6789',
    'chidi.eze@ginterior.ng',
    '/brand/logo.jpeg',
    'Chidi is our go-to expert for commercial leases and long-term lettings. His deep knowledge of Victoria Island and Lekki Grade-A office markets makes him invaluable to corporate clients.',
    true
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'Tunde Bakare',
    'Interior Design & Property Advisory',
    '+234 803 456 7890',
    '+234 803 456 7890',
    'tunde.bakare@ginterior.ng',
    '/brand/logo.jpeg',
    'Tunde bridges the gap between property and design. With a background in architecture and interior styling, he helps clients find homes and transform them into dream spaces.',
    true
  )
on conflict (id) do nothing;

-- ── Properties (conflict target: unique slug) ───────────────

-- 1. Lekki Phase 1 — featured
insert into public.properties (
  title, slug, price, listing_type, property_type,
  beds, baths, size_sqm, address, city_area, city,
  description, features, images, is_featured, status, lat, lng, agent_id
)
values (
  'Luxury 4-Bedroom Detached Duplex',
  'luxury-4-bedroom-detached-duplex-lekki',
  120000000,
  'sale', 'house',
  4, 5, 450,
  'Plot 12, Admiralty Way',
  'Lekki Phase 1', 'Lagos',
  'Exquisitely designed 4-bedroom detached duplex in the heart of Lekki Phase 1. Features imported Italian tiles, a modern open-plan kitchen, a private cinema room, and a swimming pool. Estate services include 24-hour security and constant power supply.',
  array['Swimming Pool','Private Cinema','Smart Home System','24/7 Security','Parking for 4 Cars','Staff Quarters','Central Air Conditioning','Imported Italian Tiles'],
  array['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
  true, 'available',
  6.4475, 3.4552,
  null
)
on conflict (slug) do nothing;

-- 2. Victoria Island — featured
insert into public.properties (
  title, slug, price, listing_type, property_type,
  beds, baths, size_sqm, address, city_area, city,
  description, features, images, is_featured, status, lat, lng, agent_id
)
values (
  'Modern 3-Bedroom Terrace Apartment',
  'modern-3-bedroom-terrace-victoria-island',
  85000000,
  'sale', 'apartment',
  3, 3, 280,
  'Adeola Odeku Street',
  'Victoria Island', 'Lagos',
  'Stunning 3-bedroom terrace apartment on the prestigious Adeola Odeku Street. Boasts floor-to-ceiling windows, a gourmet kitchen, en-suite bedrooms, and a private terrace. Minutes from top restaurants, banks, and corporate offices.',
  array['Floor-to-Ceiling Windows','Gourmet Kitchen','En-suite Bathrooms','Private Terrace','Generator House','CCTV Surveillance','Elevator','Serviced Estate'],
  array['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
  true, 'available',
  6.4281, 3.4219,
  null
)
on conflict (slug) do nothing;

-- 3. Ikoyi — featured
insert into public.properties (
  title, slug, price, listing_type, property_type,
  beds, baths, size_sqm, address, city_area, city,
  description, features, images, is_featured, status, lat, lng, agent_id
)
values (
  'Elegant 5-Bedroom Mansion',
  'elegant-5-bedroom-mansion-ikoyi',
  350000000,
  'sale', 'house',
  5, 6, 800,
  'Off Alexander Avenue',
  'Ikoyi', 'Lagos',
  'A breathtaking 5-bedroom mansion in the exclusive Ikoyi neighbourhood. This architectural masterpiece features a grand living room, wine cellar, home office, gym, and lush landscaped garden. A true statement of luxury living.',
  array['Wine Cellar','Home Gym','Grand Living Room','Landscaped Garden','Home Office','Servant Quarter','Intercom System','Water Treatment Plant'],
  array['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'],
  true, 'available',
  6.4490, 3.4260,
  null
)
on conflict (slug) do nothing;

-- 4. Chevron — serviced apartment, annual rent
insert into public.properties (
  title, slug, price, listing_type, property_type,
  beds, baths, size_sqm, address, city_area, city,
  description, features, images, is_featured, status, lat, lng, agent_id
)
values (
  '2-Bedroom Serviced Apartment (Annual Rent)',
  '2-bedroom-serviced-apartment-chevron',
  15000000,
  'rent', 'apartment',
  2, 2, 160,
  'Osapa London, off Chevron Estate Road',
  'Chevron', 'Lagos',
  'Fully serviced 2-bedroom apartment in a serene part of Chevron Estate. Furnished to international standards, ideal for expatriates and short-let conversions. Includes power, water, and estate security in service charge.',
  array['Fully Furnished','24/7 Power Supply','Swimming Pool Access','Gated Estate','Parking Space','Laundry Room','CCTV'],
  array['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80','https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'],
  false, 'available',
  6.4620, 3.4550,
  null
)
on conflict (slug) do nothing;

-- 5. Ikeja — mainland rental
insert into public.properties (
  title, slug, price, listing_type, property_type,
  beds, baths, size_sqm, address, city_area, city,
  description, features, images, is_featured, status, lat, lng, agent_id
)
values (
  'Spacious 3-Bedroom Flat',
  'spacious-3-bedroom-flat-ikeja',
  5000000,
  'rent', 'apartment',
  3, 2, 180,
  'Mobolaji Bank Anthony Way',
  'Ikeja', 'Lagos',
  'Well-maintained 3-bedroom flat in a quiet, accessible part of Ikeja GRA. Close to the Ikeja City Mall, hospitals, and government offices. Ideal for families seeking a comfortable neighbourhood.',
  array['En-suite Master Bedroom','Spacious Living Room','Kitchen with Pantry','Car Park (2 Cars)','24-Hour Security','Perimeter Fencing'],
  array['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80','https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80','https://images.unsplash.com/photo-1560185008-b033106af5c8?w=800&q=80'],
  false, 'available',
  6.6059, 3.3496,
  null
)
on conflict (slug) do nothing;

-- 6. Victoria Island — commercial lease
insert into public.properties (
  title, slug, price, listing_type, property_type,
  beds, baths, size_sqm, address, city_area, city,
  description, features, images, is_featured, status, lat, lng, agent_id
)
values (
  'Prime Commercial Office Space',
  'prime-commercial-office-space-victoria-island',
  45000000,
  'lease', 'land',
  0, 4, 500,
  'Bourdillon Road',
  'Victoria Island', 'Lagos',
  'Grade-A commercial office space on Bourdillon Road, Victoria Island. Open-plan layout suitable for corporate headquarters or financial institutions. Close to the Eko Hotel, banks, and embassies.',
  array['Open-Plan Layout','Central Air Conditioning','Fibre Optic Internet','Elevator (2 Lifts)','Underground Parking','Security Guard','Reception Area','Server Room'],
  array['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80','https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80','https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=800&q=80'],
  false, 'available',
  6.4334, 3.4196,
  null
)
on conflict (slug) do nothing;

-- 7. Yaba — bungalow
insert into public.properties (
  title, slug, price, listing_type, property_type,
  beds, baths, size_sqm, address, city_area, city,
  description, features, images, is_featured, status, lat, lng, agent_id
)
values (
  'Charming 4-Bedroom Bungalow',
  'charming-4-bedroom-bungalow-yaba',
  75000000,
  'sale', 'house',
  4, 3, 300,
  'Herbert Macaulay Way, Yaba',
  'Yaba', 'Lagos',
  'A charming 4-bedroom bungalow in the vibrant Yaba neighbourhood. Featuring a spacious compound, modern kitchen, and staff quarter. Ideal for families who enjoy being in the heart of Lagos commercial activity.',
  array['Staff Quarters','Spacious Compound','Modern Kitchen','Generator House','Perimeter Fence','Water Well'],
  array['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80','https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80'],
  false, 'available',
  6.5158, 3.3896,
  null
)
on conflict (slug) do nothing;

-- 8. Gbagada — short-let (per night)
insert into public.properties (
  title, slug, price, listing_type, property_type,
  beds, baths, size_sqm, address, city_area, city,
  description, features, images, is_featured, status, lat, lng, agent_id
)
values (
  'Luxury 2-Bedroom Short-Let Apartment',
  'luxury-2-bedroom-short-let-gbagada',
  500000,
  'rent', 'apartment',
  2, 2, 120,
  'Gbagada Phase 2, off Thomas Salako Street',
  'Gbagada', 'Lagos',
  'Beautifully furnished 2-bedroom short-let apartment in Gbagada. Perfect for business travellers, featuring high-speed Wi-Fi, smart TV, fully equipped kitchen, and convenient access to the Third Mainland Bridge.',
  array['Fully Furnished','High-Speed Wi-Fi','Smart TV','Air Conditioning','Kitchen Appliances','Secure Parking','24-Hour Power'],
  array['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80','https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
  false, 'available',
  6.5260, 3.3900,
  null
)
on conflict (slug) do nothing;

-- ── Testimonials (fixed UUIDs, all approved) ────────────────
insert into public.testimonials (id, client_name, text, rating, property_ref, approved)
values
  (
    '00000000-0000-4000-8000-000000000004',
    'Ngozi A.',
    'G Interior helped us find our dream home in Lekki within two weeks. Their attention to detail and knowledge of the market is unmatched. I would highly recommend them to anyone looking for property in Lagos.',
    5,
    null,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000005',
    'Emeka O.',
    'As a first-time buyer, I was nervous about the process. The team walked me through every step, from inspections to closing. Professional, transparent, and truly invested in their clients.',
    5,
    null,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000006',
    'Sarah J.',
    'We needed an office space urgently for our expanding team. Chidi at G Interior found us the perfect spot on Victoria Island within our budget. Efficient and highly professional service.',
    5,
    null,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000007',
    'Babatunde K.',
    'The interior design consultation was a game changer. Tunde completely reimagined our living space and it now looks like something out of a magazine. We could not be happier with the result.',
    5,
    null,
    true
  )
on conflict (id) do nothing;
