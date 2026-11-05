-- ALI HASSAN SUPERMART — database setup for Supabase.
-- Paste this whole file into Supabase -> SQL Editor -> New query, change the owner email
-- on the line marked  <<< CHANGE THIS  and press RUN.
-- It is safe to run again later (for example after updating the website files).
--
-- Security idea: customers can only READ products and coupons and call place_order().
-- Prices, stock, discounts, delivery fee and order numbers are all decided HERE on the server,
-- never trusted from the browser. Only the owner login can change anything else.

-- 1) Who is the owner? Only this login may manage products, orders, coupons and the owner contact.
create or replace function public.is_owner() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() ->> 'email') = 'CHANGE-ME@example.com', false);   -- <<< CHANGE THIS
$$;

-- 2) Products (customers can read; only the owner can change)
create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  brand text default 'Ali Hassan Supermart',
  category text not null,
  price numeric not null check (price > 0),
  original_price numeric,
  stock integer not null default 0 check (stock >= 0),
  description text default '',
  image text default '',
  emoji text default '📦',
  unit text default '1 piece',
  tint text default 'from-amber-500/20 to-orange-500/30',
  rating numeric default 4.5,
  reviews integer default 0,
  popularity integer default 50,
  featured boolean default false,
  best_seller boolean default false,
  created_at timestamptz not null default now()
);
alter table public.products drop constraint if exists products_name_len;
alter table public.products add constraint products_name_len check (char_length(trim(name)) between 2 and 120);
alter table public.products drop constraint if exists products_limits;
alter table public.products add constraint products_limits check (price <= 10000000 and stock <= 1000000 and char_length(coalesce(image, '')) <= 600000);
alter table public.products enable row level security;
drop policy if exists "anyone reads products" on public.products;
drop policy if exists "owner writes products" on public.products;
create policy "anyone reads products" on public.products for select to anon, authenticated using (true);
create policy "owner writes products" on public.products for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- 2b) Categories (customers read; only the owner changes them; a category that still has products cannot be deleted)
create table if not exists public.categories (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  name text not null check (char_length(trim(name)) between 2 and 80),
  short text,
  emoji text default '📦',
  tint text default 'from-amber-500/20 to-orange-500/30',
  blurb text default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create unique index if not exists categories_name_unique on public.categories (lower(trim(name)));
alter table public.categories enable row level security;
drop policy if exists "anyone reads categories" on public.categories;
drop policy if exists "owner writes categories" on public.categories;
create policy "anyone reads categories" on public.categories for select to anon, authenticated using (true);
create policy "owner writes categories" on public.categories for all to authenticated using (public.is_owner()) with check (public.is_owner());
insert into public.categories (slug, name, short, emoji, tint, blurb, sort_order) values
  ('grocery', 'Grocery & Daily Essentials', 'Grocery', '🛒', 'from-amber-500/20 to-orange-500/30', 'Rice, flour, oil, tea, spices and everyday kitchen staples.', 0),
  ('biscuits-snacks', 'Biscuits & Snacks', 'Snacks', '🍪', 'from-yellow-500/20 to-amber-500/30', 'Crunchy biscuits, chips, nuts and sweet treats.', 1),
  ('cosmetics-beauty', 'Cosmetics & Beauty', 'Beauty', '💄', 'from-pink-500/20 to-rose-500/30', 'Makeup, skincare and beauty essentials.', 2),
  ('shampoos-personal-care', 'Shampoos & Personal Care', 'Personal Care', '🧴', 'from-sky-500/20 to-cyan-500/30', 'Shampoos, soaps, toothpaste and daily grooming.', 3),
  ('sports-fitness', 'Sports & Fitness', 'Sports', '🏏', 'from-green-500/20 to-emerald-500/30', 'Cricket, football, gym gear and fitness accessories.', 4),
  ('stationery', 'Stationery & School Supplies', 'Stationery', '✏️', 'from-indigo-500/20 to-blue-500/30', 'Notebooks, pens, geometry boxes and school bags.', 5),
  ('kitchen-utensils', 'Kitchen & Utensils', 'Kitchen', '🍳', 'from-stone-500/20 to-orange-500/30', 'Cookware, cutlery, containers and kitchen tools.', 6),
  ('ice-cream-frozen', 'Ice Creams & Frozen Foods', 'Frozen', '🍦', 'from-cyan-500/20 to-sky-500/30', 'Ice creams, nuggets, kebabs and frozen favourites.', 7),
  ('household-cleaning', 'Household & Cleaning Products', 'Cleaning', '🧼', 'from-teal-500/20 to-emerald-500/30', 'Detergents, floor cleaners, tissues and disinfectants.', 8),
  ('beverages', 'Beverages & Drinks', 'Beverages', '🥤', 'from-red-500/20 to-orange-500/30', 'Juices, soft drinks, tea, coffee and water.', 9),
  ('bakery', 'Bakery Products', 'Bakery', '🥖', 'from-amber-500/20 to-yellow-500/30', 'Fresh bread, rusks, cakes and baking needs.', 10),
  ('home-accessories', 'Home Accessories', 'Home', '🏠', 'from-violet-500/20 to-purple-500/30', 'Decor, storage, bedding and handy home items.', 11)
on conflict (slug) do nothing;
-- NOT VALID = the rule applies to every new or changed product without failing on old rows.
alter table public.products drop constraint if exists products_category_fkey;
alter table public.products add constraint products_category_fkey foreign key (category) references public.categories (slug) on update cascade on delete restrict not valid;

-- 3) Coupons (customers can read the codes; the server re-checks them on every order)
create table if not exists public.coupons (
  code text primary key check (code ~ '^[A-Z0-9]{3,16}$'),
  type text not null check (type in ('percent', 'flat', 'shipping')),
  value numeric not null default 0 check (value >= 0),
  min_subtotal numeric,
  label text default '',
  active boolean not null default true,
  check (type <> 'percent' or value <= 90)
);
alter table public.coupons enable row level security;
drop policy if exists "anyone reads coupons" on public.coupons;
drop policy if exists "owner writes coupons" on public.coupons;
create policy "anyone reads coupons" on public.coupons for select to anon, authenticated using (true);
create policy "owner writes coupons" on public.coupons for all to authenticated using (public.is_owner()) with check (public.is_owner());
alter table public.coupons add column if not exists expires_at timestamptz;
alter table public.coupons add column if not exists usage_limit integer;
alter table public.coupons add column if not exists used_count integer not null default 0;
alter table public.coupons drop constraint if exists coupons_limits;
alter table public.coupons add constraint coupons_limits check ((usage_limit is null or usage_limit > 0) and used_count >= 0);
insert into public.coupons (code, type, value, min_subtotal, label) values
  ('WELCOME10', 'percent', 10, null, '10% off your order'),
  ('SAVE200', 'flat', 200, 2000, 'Rs. 200 off'),
  ('FREESHIP', 'shipping', 0, null, 'Free delivery')
on conflict (code) do nothing;

-- 4) Orders (customers cannot read or write this table directly; they use place_order() below)
create table if not exists public.orders (
  id text primary key,
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric not null,
  discount numeric not null default 0,
  delivery_fee numeric not null default 0,
  total numeric not null,
  coupon text,
  payment text default 'Cash on Delivery',
  status text not null default 'Pending',
  follow_up_sent boolean not null default false,
  stock_restored boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.orders add column if not exists stock_restored boolean not null default false;
update public.orders set status = 'Out for Delivery' where status = 'Shipped';   -- older name for the same step
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (status in ('Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'));
alter table public.orders enable row level security;
drop policy if exists "customers place orders" on public.orders;   -- replaced by place_order()
drop policy if exists "owner manages orders" on public.orders;
create policy "owner manages orders" on public.orders for all to authenticated using (public.is_owner()) with check (public.is_owner());
drop trigger if exists orders_reduce_stock on public.orders;       -- replaced by place_order()
drop function if exists public.reduce_stock_on_order();

create sequence if not exists public.order_number_seq;

-- 5) place_order(): the only way customers create an order. Everything is re-checked here.
create or replace function public.place_order(p_order jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  cust jsonb := p_order -> 'customer';
  item jsonb;
  prod public.products%rowtype;
  cp public.coupons%rowtype;
  qty int;
  clean jsonb := '[]'::jsonb;
  sub numeric := 0;
  disc numeric := 0;
  fee numeric := 0;
  v_code text := nullif(upper(trim(coalesce(p_order ->> 'coupon', ''))), '');
  new_id text;
begin
  -- customer details
  if cust is null or jsonb_typeof(cust) <> 'object' or length(cust::text) > 3000 then raise exception 'Invalid customer details'; end if;
  if length(trim(coalesce(cust ->> 'name', ''))) < 3 then raise exception 'Please enter your full name'; end if;
  if coalesce(cust ->> 'phone', '') !~ '^(\+92|0)?3[0-9]{2}[- ]?[0-9]{7}$' then raise exception 'Please enter a valid Pakistani mobile number'; end if;
  if length(trim(coalesce(cust ->> 'address', ''))) < 10 then raise exception 'Please enter your complete delivery address'; end if;
  if length(trim(coalesce(cust ->> 'city', ''))) < 2 then raise exception 'Please select your city'; end if;

  -- items: prices come from the products table, stock is checked and reduced here
  if jsonb_typeof(p_order -> 'items') is distinct from 'array' then raise exception 'Your cart is empty'; end if;
  if jsonb_array_length(p_order -> 'items') not between 1 and 50 then raise exception 'Your cart is empty or too large'; end if;
  for item in select * from jsonb_array_elements(p_order -> 'items') loop
    qty := coalesce((item ->> 'qty')::int, 0);
    if qty < 1 or qty > 99 then raise exception 'Invalid quantity'; end if;
    select * into prod from public.products where id = (item ->> 'id')::bigint for update;
    if not found then raise exception 'An item in your cart is no longer available'; end if;
    if prod.stock < qty then
      raise exception '%', case when prod.stock = 0 then format('"%s" is out of stock', prod.name) else format('Only %s of "%s" left in stock', prod.stock, prod.name) end;
    end if;
    update public.products set stock = stock - qty where id = prod.id;
    sub := sub + prod.price * qty;
    clean := clean || jsonb_build_array(jsonb_build_object('id', prod.id, 'name', prod.name, 'qty', qty, 'price', prod.price, 'emoji', prod.emoji, 'tint', prod.tint));
  end loop;

  -- coupon and delivery fee (same rules as the website: free delivery from Rs. 3,000, otherwise Rs. 199)
  if v_code is not null then
    select * into cp from public.coupons where public.coupons.code = v_code and active for update;   -- row lock: two orders cannot both take the last use
    if not found or (cp.min_subtotal is not null and sub < cp.min_subtotal) then raise exception 'This coupon is not valid for your order'; end if;
    if cp.expires_at is not null and cp.expires_at <= now() then raise exception 'This coupon has expired'; end if;
    if cp.usage_limit is not null and cp.used_count >= cp.usage_limit then raise exception 'This coupon has reached its usage limit'; end if;
    update public.coupons set used_count = used_count + 1 where public.coupons.code = cp.code;
    if cp.type = 'percent' then disc := round(sub * cp.value / 100);
    elsif cp.type = 'flat' then disc := least(cp.value, sub);
    end if;
  end if;
  if cp.type = 'shipping' then fee := 0;
  elsif sub - disc >= 3000 then fee := 0;
  else fee := 199;
  end if;

  new_id := 'AHS-' || to_char(now(), 'YYMMDD') || '-' || lpad(nextval('public.order_number_seq')::text, 4, '0');
  insert into public.orders (id, customer, items, subtotal, discount, delivery_fee, total, coupon, payment, status)
  values (
    new_id,
    jsonb_build_object('name', trim(cust ->> 'name'), 'phone', trim(cust ->> 'phone'), 'city', trim(cust ->> 'city'),
                       'address', trim(cust ->> 'address'), 'notes', left(coalesce(cust ->> 'notes', ''), 300)),
    clean, sub, disc, fee, greatest(sub - disc + fee, 0), v_code, 'Cash on Delivery', 'Pending'
  );

  return jsonb_build_object(
    'id', new_id, 'status', 'Pending', 'payment', 'Cash on Delivery', 'coupon', v_code,
    'customer', jsonb_build_object('name', trim(cust ->> 'name'), 'phone', trim(cust ->> 'phone'), 'city', trim(cust ->> 'city'),
                                   'address', trim(cust ->> 'address'), 'notes', left(coalesce(cust ->> 'notes', ''), 300)),
    'items', clean, 'subtotal', sub, 'discount', disc, 'deliveryFee', fee, 'total', greatest(sub - disc + fee, 0),
    'createdAt', (extract(epoch from now()) * 1000)::bigint
  );
end $$;
revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;

-- 6) Order updates: only valid status moves, stock is put back exactly once on cancellation,
--    and the money / items / customer of an order can never be edited afterwards.
create or replace function public.guard_order_update() returns trigger
language plpgsql security definer set search_path = public as $$
declare item jsonb;
begin
  if new.status is distinct from old.status then
    if not (
      (old.status = 'Pending'    and new.status in ('Confirmed', 'Cancelled')) or
      (old.status = 'Confirmed'  and new.status in ('Processing', 'Cancelled')) or
      (old.status = 'Processing' and new.status in ('Out for Delivery', 'Cancelled')) or
      (old.status = 'Out for Delivery' and new.status in ('Delivered', 'Cancelled'))
    ) then
      raise exception 'An order cannot move from % to %', old.status, new.status;
    end if;
    if new.status = 'Cancelled' and not old.stock_restored then
      for item in select * from jsonb_array_elements(old.items) loop
        update public.products set stock = stock + coalesce((item ->> 'qty')::int, 0) where id = (item ->> 'id')::bigint;
      end loop;
      if old.coupon is not null then   -- a cancelled order gives its coupon use back (once, same guard as the stock)
        update public.coupons set used_count = greatest(used_count - 1, 0) where public.coupons.code = old.coupon;
      end if;
      new.stock_restored := true;
    end if;
  end if;
  new.id := old.id;
  new.customer := old.customer;
  new.items := old.items;
  new.subtotal := old.subtotal;
  new.discount := old.discount;
  new.delivery_fee := old.delivery_fee;
  new.total := old.total;
  new.coupon := old.coupon;
  new.created_at := old.created_at;
  if old.stock_restored then new.stock_restored := true; end if;
  return new;
end $$;
drop trigger if exists orders_guard_update on public.orders;
create trigger orders_guard_update before update on public.orders
  for each row execute function public.guard_order_update();

-- 7) Owner contact (one row). Readable by the store so new-order emails / WhatsApp can be sent;
--    only the owner can save or delete it ("Reset" deletes the row).
create table if not exists public.owner_contact (
  id integer primary key default 1 check (id = 1),
  phone text default '',
  email text default '',
  updated_at timestamptz default now()
);
alter table public.owner_contact enable row level security;
drop policy if exists "anyone reads owner contact" on public.owner_contact;
drop policy if exists "owner writes owner contact" on public.owner_contact;
create policy "anyone reads owner contact" on public.owner_contact for select to anon, authenticated using (true);
create policy "owner writes owner contact" on public.owner_contact for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- 8) Newsletter (customers can only subscribe through the function; only the owner can read the list)
create table if not exists public.newsletter_subscribers (
  email text primary key check (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
drop policy if exists "owner manages subscribers" on public.newsletter_subscribers;
create policy "owner manages subscribers" on public.newsletter_subscribers for all to authenticated using (public.is_owner()) with check (public.is_owner());

create or replace function public.subscribe_newsletter(p_email text) returns text
language plpgsql security definer set search_path = public as $$
declare e text := lower(trim(coalesce(p_email, '')));
begin
  if char_length(e) > 254 or e !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Please enter a valid email address';
  end if;
  insert into public.newsletter_subscribers (email) values (e) on conflict (email) do nothing;
  if found then return 'subscribed'; end if;
  return 'already';
end $$;
revoke all on function public.subscribe_newsletter(text) from public;
grant execute on function public.subscribe_newsletter(text) to anon, authenticated;
