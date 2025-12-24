'use strict';

window.EMAILJS_CONFIG = {
  serviceId: 'service_vv8pzo9',
  templateId: 'template_hwa5k5g',
  publicKey: 'IpEwibNO6jUg-gZK7'
};

if (typeof emailjs !== 'undefined') {
  emailjs.init(window.EMAILJS_CONFIG.publicKey);
}

const elementToggleFunc = (elem) => elem.classList.toggle("active");
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
if (sidebarBtn) sidebarBtn.addEventListener("click", () => elementToggleFunc(sidebar));

const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = (selectedValue) => {
  filterItems.forEach(item => {
    if (selectedValue === "all") {
      item.classList.add("active");
    } else if (selectedValue === item.dataset.category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};

let lastClickedBtn = filterBtn[0];
filterBtn.forEach(btn => {
  btn.addEventListener("click", function() {
    const selectedValue = this.textContent.toLowerCase();
    filterFunc(selectedValue);
    lastClickedBtn.classList.remove("btn-primary");
    lastClickedBtn.classList.add("btn-ghost");
    this.classList.remove("btn-ghost");
    this.classList.add("btn-primary", "active");
    lastClickedBtn = this;
  });
});

const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formAlert = document.getElementById("form-alert");
const formSpinner = document.getElementById("form-spinner");

if (formInputs && form) {
  formInputs.forEach(input => {
    input.addEventListener("input", () => {
      if (form.checkValidity()) {
        if (formBtn) formBtn.removeAttribute("disabled");
      } else {
        if (formBtn) formBtn.setAttribute("disabled", "");
      }
      if (formAlert) formAlert.classList.add("hidden");
    });
  });
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) return;
    
    const formData = new FormData(form);
    const name = formData.get('from_name');
    const email = formData.get('from_email');
    const message = formData.get('message');
    
    const isEmailJSConfigured = typeof emailjs !== 'undefined' && 
                                 window.EMAILJS_CONFIG && 
                                 window.EMAILJS_CONFIG.serviceId;
    
    if (isEmailJSConfigured) {
      if (formSpinner) formSpinner.classList.remove("hidden");
      if (formBtn) formBtn.setAttribute("disabled", "");
      
      try {
        await emailjs.sendForm(
          window.EMAILJS_CONFIG.serviceId,
          window.EMAILJS_CONFIG.templateId,
          form,
          window.EMAILJS_CONFIG.publicKey
        );
        
        formAlert.className = "alert alert-success mb-4";
        formAlert.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>Message sent successfully! I\'ll get back to you soon.</span>';
        formAlert.classList.remove("hidden");
        form.reset();
        if (formBtn) formBtn.setAttribute("disabled", "");
      } catch (error) {
        console.error('EmailJS Error:', error);
        showMailtoFallback(name, email, message);
      } finally {
        if (formSpinner) formSpinner.classList.add("hidden");
        if (formBtn) formBtn.removeAttribute("disabled");
      }
    } else {
      showMailtoFallback(name, email, message);
    }
  });
}

function showMailtoFallback(name, email, message) {
  const subject = encodeURIComponent(`Contact Form Message from ${name}`);
  const body = encodeURIComponent(`Hello Ao Tian,\n\nMy name is ${name}.\nMy email is ${email}.\n\n${message}\n\n---\nSent from your personal website contact form`);
  const mailtoLink = `mailto:ta248006220@gmail.com?subject=${subject}&body=${body}`;
  
  formAlert.className = "alert alert-info mb-4";
  formAlert.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><div><p class="font-bold">Opening your email client...</p><p class="text-sm">If it doesn't open automatically, <a href="${mailtoLink}" class="underline font-bold">click here to email me directly</a></p></div>`;
  formAlert.classList.remove("hidden");
  
  setTimeout(() => {
    window.location.href = mailtoLink;
  }, 300);
}

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach(link => {
  link.addEventListener("click", function() {
    let pageName = this.textContent.toLowerCase().trim();
    if (pageName === "case studies") pageName = "case studies";
    pages.forEach(page => {
      const pageData = page.dataset.page.toLowerCase();
      if (pageData === pageName || (pageName === "case studies" && pageData === "case studies")) {
        page.classList.add("active");
        navigationLinks.forEach(l => {
          l.classList.remove("active", "text-primary");
          l.classList.add("text-base-content/70");
          if (l.classList.contains("btn-ghost")) {
            l.classList.add("btn-ghost");
          }
        });
        this.classList.add("active", "text-primary");
        this.classList.remove("text-base-content/70");
        if (this.classList.contains("btn-ghost")) {
          this.classList.remove("btn-ghost");
        }
        window.scrollTo(0, 0);
      } else {
        page.classList.remove("active");
      }
    });
  });
});
