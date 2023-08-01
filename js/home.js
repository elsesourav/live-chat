import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
   getAuth,
   signInWithEmailAndPassword,
   createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import {
   set, get, getDatabase, query, ref, update,
   orderByChild, equalTo, onValue, onChildChanged, onChildAdded, 
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";


// import { getDatabase, ref, onDisconnect } from "firebase/database";

// const db = getDatabase();
// const presenceRef = ref(db, "disconnectmessage");
// // Write a string when this client loses connection
// onDisconnect(presenceRef).set("I disconnected!");


window.onload = async () => {

   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const analytics = getAnalytics(app);
   const auth = getAuth();
   const db = getDatabase();

   const dbRefInfo = ref(db, `users_data/info/${userId}`);
   const dbRefStatus = ref(db, `users_data/status/${userId}`);
   const dbRefFriends = ref(db, `users_data/friends/${userId}`);
   const dbRefImage = ref(db, `users_data/image/${userId}`);
   const dbRefChats = ref(db, `users_data/chats/${userId}`);


   if (!data) {
      try {
         const info = await get(dbRefInfo);
         const status = await get(dbRefStatus);
         const friends = await get(dbRefFriends);
         const image = await get(dbRefImage);
         const chats = await get(dbRefChats);

         const obj = {
            info: info,
            status: status,
            friends: friends,
            image: image,
            chats: chats
         }
         data = obj;
         
         setupFriends();
      } catch (e) {
         location.reload();
      }
   }

   setInterval(async () => {
      try {
         await update(dbRefStatus, {
            lastOnline: Date.now()
         })
      } catch (error) {
         console.log("Something went wrong!");
         console.log(error);
      }

   }, 60_000);


   pageLoad.classList.remove("active");


   // Friends Update Changes Realtime 

   // Friends
   onValue(dbRefFriends, (snapshot) => {
      data.friends = snapshot.val() || {};
      
   });

   // Info
   onValue(dbRefInfo, (snapshot) => {
      data.info = snapshot.val();
      
   });

   // Images
   onValue(dbRefImage, (snapshot) => {
      data.image = snapshot.val() || {};
      
   });

   // Status
   onValue(dbRefStatus, (snapshot) => {
      data.status = snapshot.val() || {};
      
   });


   onChildAdded(dbRefChats, (snapshot) => {



      updateChildFafences();
   });

   function setupChatChaild(key) {
      // Chat
      try {
         const rf = ref(db, `users_data/chats/${userId}/${key}`);
         onChildChanged(rf, (snapshot) => {
            console.log(snapshot.val());
            data.chats[key][getOptimizeDate().full] = snapshot.val() || {};
            
            setupFriends();
         });
      } catch (e) {
         console.log(e);
      }
   }

   function updateChildFafences() {
      for (const key in data.friends) {

      }
   }
   updateChildFafences();








   // pointer events for mobile devices
   if (isMobile) {
      document.head.append(`<style>* { pointer-events: none; }</style>`)
   }

   const toggleCancleNewBtn = ID("toggle-cancle-new-btn");
   const indexHeader = ID("index-header");
   const scrollBox = ID("scroll-box");
   const profileBack = ID("profile-back");
   // const wrapContacts = ID("wrap-contacts");
   const profileBtn = ID("profile-btn");


   toggleCancleNewBtn.on(() => {
      indexHeader.classList.toggle("active");
   });

   // defualt chat open off
   let bodyMaxScroll = scrollBox.scrollHeight - scrollBox.clientHeight
   document.body.classList.remove("active")

   function setContacts() {
      let str = "";
      myDtls.contacts.forEach((e, i) => {
         str += `
            <div class="contact-box">
               <div class="wrap">
                  <div class="contact-icon">
                     <span>
                        <i class="sbi-user"></i>
                        <img src="" class="contect-img" alt="contect image">
                     </span>
                  </div>
                  <div class="contact-datas">
                     <div class="contact-name-time">
                        <div class="contact-name">Contact Name</div>
                        <div class="last-chat-time">00:00</div>
                     </div>
                     <div class="last-chat-no-of-msg">
                        <div class="last-chat">Last Chat</div>
                        <div class="no-of-msg"><p>${Math.floor(Math.random() * 10) + 1}</p></div>
                     </div>
                  </div>
               </div>
            </div>
          `;
      })
      // wrapContacts.innerHTML = str;
   }
   // setContacts();

   const contactBox = $(".contact-box");
   contactBox.on((e) => {
      document.body.classList.add("active");
      bodyMaxScroll = scrollBox.scrollWidth - scrollBox.clientWidth;
      smoothScroll(scrollBox, "scrollLeft", bodyMaxScroll, 100);
   });

   profileBack.on(() => {
      smoothScroll(scrollBox, "scrollLeft", -bodyMaxScroll, 100);
   });

   profileBtn.addEventListener("click", () => {
      window.location.replace("profile.html");
   });
}
