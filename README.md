# Brew & Bean Coffee House

A premium coffee shop website built with plain HTML, CSS, and JavaScript.

This project is designed as a frontend portfolio project. It demonstrates how a real café website can combine attractive design with useful interactions such as menu filtering, drink customization, a shopping cart, checkout, table reservations, and gallery interactions.

## What This Project Includes

- Responsive coffee shop landing page
- Sticky responsive navigation bar
- Hero section with coffee imagery and calls to action
- About/story section
- Coffee preparation process section
- Searchable and filterable menu
- Coffee, espresso, cold coffee, tea, dessert, and snack categories
- Drink customization:
  - Size selection
  - Milk selection
  - Extra espresso shot
- Shopping cart with quantity controls
- Cart data saved in browser `localStorage`
- Checkout form for pickup or delivery
- Delivery fee calculation
- Order confirmation with an order number
- Table reservation form
- Contact form validation
- Special offer countdown
- Gallery lightbox
- Customer review carousel
- Scroll reveal animations
- Active navigation highlighting
- Back-to-top button
- Mobile and tablet responsive layouts

## Technologies Used

This project uses web platform basics:

- **HTML5** for page structure and content
- **CSS3** for layout, colors, typography, responsive design, and animation
- **JavaScript** for user interaction and application logic
- **Font Awesome** for icons
- **Google Fonts** for typography
- **Unsplash** for demo coffee images

No frontend framework is required. There is no React, Vue, or backend server in this project.

## Project Files

### `index.html`

This is the structure of the website.

It contains:

- The navigation bar
- Hero section
- About section
- Menu container
- Offer section
- Gallery
- Reviews
- Reservation form
- Contact form
- Cart sidebar
- Drink customization modal
- Checkout modal
- Gallery lightbox

HTML uses elements such as:

```html
<section>
<article>
<form>
<button>
<input>
```

These elements make the page easier for browsers, search engines, screen readers, and developers to understand.

### `style.css`

This file controls the appearance of the website.

It contains:

- CSS variables for the color palette
- Page spacing and layout
- Grid and flexbox layouts
- Responsive media queries
- Buttons and cards
- Modal and sidebar styling
- Hover effects
- Scroll reveal animations
- Mobile layouts

The CSS variables are defined near the beginning:

```css
:root {
    --coffee-dark: #26170f;
    --coffee: #67432d;
    --cream: #f4ede3;
}
```

A CSS variable lets us reuse the same value in many places. If we change `--coffee` once, every element using that variable can update.

### `script.js`

This file controls the behavior of the website.

It contains:

- Mobile menu behavior
- Menu data and dynamic menu rendering
- Search and category filtering
- Drink customization
- Shopping cart logic
- Local storage
- Checkout behavior
- Contact form validation
- Table reservation validation
- Countdown timer
- Gallery lightbox
- Review carousel
- Scroll animations
- Active navigation state
- Back-to-top behavior

## How To Run The Project

This is a simple static website, so no installation is required.

### Option 1: Open Directly

Double-click `index.html` to open it in your browser.

### Option 2: Use VS Code Live Server

1. Install the **Live Server** extension in VS Code.
2. Open `index.html`.
3. Right-click inside the file.
4. Select **Open with Live Server**.

Live Server is useful because the browser refreshes automatically after changes.

## How The Main Features Work

### 1. Dynamic Menu

The menu items are stored in a JavaScript array instead of writing every card manually in HTML.

Example:

```javascript
const coffeeMenu = [
    {
        name: "Cappuccino",
        category: "hot",
        price: 180
    }
];
```

The `renderMenu()` function reads this array and creates the menu cards.

Why this is useful:

- Menu items are easier to update
- The same data can be used for search and filtering
- It reduces repeated HTML
- It is closer to how real applications work

### 2. Search and Filtering

Each menu card has a category and name. When the user types or selects a category, JavaScript checks which items match.

Important concepts:

- `input` event
- `click` event
- `data-*` attributes
- `includes()` for text matching
- Updating an element's `style.display`

### 3. Drink Customization

When a user clicks **Add to Cart**, a modal opens.

The user can choose:

- Size
- Milk type
- Extra espresso shot

JavaScript calculates the new price:

```javascript
const total = basePrice + sizePrice + milkPrice + extraShotPrice;
```

The customized details are saved with the cart item so two versions of the same drink can exist separately.

### 4. Shopping Cart

The cart is stored in an array:

```javascript
let cart = [];
```

When an item is added:

1. JavaScript checks whether the item already exists.
2. If it exists, its quantity increases.
3. Otherwise, a new item is added.
4. The cart is saved.
5. The cart UI is rendered again.

### 5. Local Storage

The cart remains after refreshing because it uses browser storage:

```javascript
localStorage.setItem("brewBeanCart", JSON.stringify(cart));
```

To read it later:

```javascript
const cart = JSON.parse(localStorage.getItem("brewBeanCart")) || [];
```

`localStorage` stores strings, so JavaScript uses:

- `JSON.stringify()` to convert data into a string
- `JSON.parse()` to convert it back into an array or object

Important limitation: `localStorage` belongs only to the browser. It is not a real database and it does not send orders to a café.

### 6. Checkout

The checkout modal collects:

- Customer name
- Phone number
- Pickup or delivery choice
- Address when delivery is selected

The form uses HTML validation such as:

```html
<input required>
```

JavaScript then creates a simple demo order number and clears the cart after confirmation.

This is a frontend demonstration. A production checkout would need:

- A backend
- Secure payment processing
- Database storage
- Authentication or order tracking
- Server-side validation

### 7. Table Reservation

The reservation form prevents past dates by setting the minimum date to today:

```javascript
reservationDate.min = localToday;
```

This demonstrates:

- Reading form values
- Comparing dates
- Showing success or error messages
- Resetting a form after submission

The current reservation is a frontend demo. It does not save data to a server.

### 8. Gallery Lightbox

Clicking a gallery image opens a larger version in a full-screen overlay.

JavaScript reads the clicked image's:

- `src`
- `alt`
- Caption text

Then it copies those values into the lightbox.

### 9. Review Carousel

The review cards are placed in a horizontal flex layout. JavaScript moves the track using CSS transforms:

```javascript
reviewsTrack.style.transform = `translateX(-${distance}px)`;
```

The number of visible cards changes depending on the viewport width.

### 10. Scroll Animations

The project uses `IntersectionObserver` to detect when sections enter the viewport.

Instead of constantly checking scroll position manually, the browser tells us when an element becomes visible.

This is more efficient and is a useful modern browser API to learn.

## Beginner Learning Path

Learn these topics in this order:

### Step 1: HTML Basics

Learn:

- Elements and attributes
- Headings and paragraphs
- Links and images
- Forms and inputs
- Semantic elements such as `header`, `main`, `section`, `article`, and `footer`

Practice:

- Change the café name
- Add a new section
- Add a new menu item manually

### Step 2: CSS Basics

Learn:

- Selectors
- Classes and IDs
- Box model
- Margin and padding
- Colors and typography
- Flexbox
- CSS Grid
- Media queries

Practice:

- Change the coffee color
- Change card spacing
- Make the menu use three columns on desktop
- Adjust the mobile layout

### Step 3: JavaScript Basics

Learn:

- Variables with `const` and `let`
- Functions
- Arrays and objects
- Conditions
- Loops
- DOM selection
- Events

Practice:

- Change the toast message
- Add a button click counter
- Add a new filter
- Log cart data using `console.log(cart)`

### Step 4: DOM Manipulation

Learn:

- `document.querySelector()`
- `querySelectorAll()`
- `textContent`
- `innerHTML`
- `classList.add()`
- `classList.remove()`
- `classList.toggle()`

Practice:

- Change a heading when a button is clicked
- Show and hide a message
- Add a new card dynamically

### Step 5: Browser Storage

Learn:

- `localStorage.setItem()`
- `localStorage.getItem()`
- `JSON.stringify()`
- `JSON.parse()`

Practice:

- Save a favorite coffee
- Save a theme preference
- Save a customer's name

## Suggested Next Improvements

These would make the project more realistic:

1. Move all menu data into a separate `menu-data.js` file.
2. Add a real backend API for orders and reservations.
3. Add a database for products, users, and orders.
4. Add real payment integration using a secure payment provider.
5. Add server-side validation.
6. Add an admin dashboard to manage menu items.
7. Add a real map embed for the café location.
8. Add automated tests for cart totals and reservation validation.
9. Add an offline fallback for images.
10. Deploy the website with GitHub Pages or Netlify.

## Useful Interview Explanation

You can describe this project like this:

> Brew & Bean is a responsive coffee shop ordering experience built with HTML, CSS, and vanilla JavaScript. I created a data-driven menu with category filtering, drink customization, persistent cart state using localStorage, checkout and reservation flows, and interactive gallery and review components. The project focuses on reusable frontend logic, responsive design, accessibility, and realistic user journeys.

## Validation

To check JavaScript syntax in the terminal, run:

```powershell
node --check script.js
```

A successful check produces no output and returns exit code `0`.

## Important Project Limitation

This is currently a frontend-only project.

The following are demonstrations rather than real server features:

- Checkout does not process payments
- Orders are not sent to a business
- Reservations are not stored in a database
- Contact messages are not sent by email
- Images are loaded from external URLs

That is completely acceptable for a frontend portfolio project. In an interview, explain honestly what is implemented in the browser and what would require a backend.
#   c o f f e e s h o p  
 