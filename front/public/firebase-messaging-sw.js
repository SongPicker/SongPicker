/* eslint-disable no-undef */
/* global importScripts, firebase */

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBYT8BnHPExzOlAuWyLIL76s2kxuByDPWA',
  authDomain: 'songpicker-2a701.firebaseapp.com',
  projectId: 'songpicker-2a701',
  storageBucket: 'songpicker-2a701.appspot.com',
  messagingSenderId: '231603727412',
  appId: '1:231603727412:web:5105f30fadb5e3052cae61',
  measurementId: 'G-61VC34CKW2',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('백그라운드 메시지 수신:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/favicon-196x196.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// self.addEventListener('push', function (event) {
//   if (event.data) {
//     const payload = event.data.json();
//     const title = payload.notification.title;
//     const options = {
//       body: payload.notification.body,
//       icon: payload.notification.icon || '/icons/favicon-196x196.png',
//       data: payload.data,
//     };
//     event.waitUntil(self.registration.showNotification(title, options));
//   }
// });

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
