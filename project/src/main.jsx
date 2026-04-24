// Entry — imports every module in exact load order so side-effect
// `window.X = X` assignments fire before <App/> mounts.
import React from 'react';
import ReactDOM from 'react-dom/client';

// Tokens + shared building blocks (populate window globals)
import './tokens.js';
import './icons.jsx';
import './shell.jsx';
import './atoms.jsx';
import './walletAtoms.jsx';

// Pages (each assigns window.XxxPage)
import './pages/Login.jsx';
import './pages/Listing.jsx';
import './pages/Filter.jsx';
import './pages/Product.jsx';
import './pages/SideDrawer.jsx';
import './pages/StoreLocator.jsx';
import './pages/GoldSchemes.jsx';
import './pages/BookMyGold.jsx';
import './pages/Calculator.jsx';
import './pages/Refer.jsx';
import './pages/Home.jsx';
import './pages/Profile.jsx';
import './pages/Orders.jsx';
import './pages/OrderDetails.jsx';
import './pages/Notifications.jsx';
import './pages/Search.jsx';
import './pages/Wishlist.jsx';
import './pages/Addresses.jsx';
import './pages/Loyalty.jsx';
import './pages/LoyaltyRegister.jsx';
import './pages/Coupons.jsx';
import './pages/Cart.jsx';
import './pages/Checkout.jsx';
import './pages/TodaysRate.jsx';
import './pages/Categories.jsx';
import './pages/CustomiseJewel.jsx';
import './pages/WalletHub.jsx';
import './pages/DigitalGold.jsx';
import './pages/Liquidation.jsx';
import './pages/VoucherWallet.jsx';
import './pages/BankAccounts.jsx';
import './pages/JewelSip.jsx';

// Root router (defines window.App)
import './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(window.App)
);
