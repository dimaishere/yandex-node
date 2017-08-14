const sampleData = {
  "fio": "Ivanov Ivan Ivanovich",
  "email": "ivanov@yandex.ru",
  "phone": "+7(111)111-11-11"
};
const form = document.getElementById("myForm");
const submitButton = document.getElementById("submitButton");
const result = document.getElementById('resultContainer');

const myForm = {
  validate: () => {
    let isValid = true, errorFields = [];

    // Validate Name
    const fio = document.getElementById('fio').value;
    const words = document.getElementById('fio').value.trim().split(/\s+/).length;

    if (words !== 3) {
      isValid = false;
      errorFields.push('fio');
    }

    if (!/^[a-zA-Z а-яА-Я]*$/g.test(fio)) {
      isValid = false;
      errorFields.push('fio');
    }

    // Validate Email
    const domains = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
    const domain = document.getElementById('email').value.replace(/.*@/, '');
    if (!domains.includes(domain)) {
      isValid = false;
      errorFields.push('email');
    }

    // Validate Phone
    const phoneNumber = document.getElementById('phone').value;
    const phoneRegExp = new RegExp(/^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/);

    let sum = (number) => {
      return number.match(/\d/g).reduce((a, b) => +a + +b);
    };

    if (phoneRegExp.test(phoneNumber)) {
      if (sum(phoneNumber) >= 30) {
        isValid = false;
        errorFields.push('phone');
      }
    } else {
      isValid = false;
      errorFields.push('phone');
    }

    return {isValid, errorFields};
  },

  getData: () => {
    return [].reduce.call(form.elements, (data, el) => {
      if (['fio', 'email', 'phone'].includes(el.name)) {
        data[el.name] = el.value;
      }
      return data;
    }, {});
  },

  setData: (obj) => {
    for (const prop of Object.keys(obj)) {
      const value = obj[prop];
      if (['fio', 'email', 'phone'].includes(prop)) {
        form.elements[prop].value = value;
      }
    }
  },

  submit: function() {
  for (let input of document.getElementsByTagName('input')) {
    input.classList.remove('error');
  }
  result.className = '';
  result.innerHTML = '';


  if (this.validate().isValid) {
    submitButton.disabled = true;
    let getResponse = () => {
      const resPromise = fetch(document.getElementById('myForm').action);
      resPromise.then(data => data.json()).then(data => {        
        if (data.status === 'success') {
          result.className = 'success';
          result.innerHTML = 'Success';
        } else if (data.status === 'error') {
          result.className = 'error';
          result.innerHTML = data.reason;
        } else if (data.status === 'progress') {
          result.className = 'progress';
          setTimeout(() => {
            console.log('Request');
            getResponse();
          }, data.timeout);
        }
      });    
    };
    getResponse();        
  } else {
      for (let field of this.validate().errorFields) {
        document.getElementById(field).className = 'error';
      }
    }
  }
}

const handleForm = (e) => {
  e.preventDefault();
  myForm.submit();  
}

form.addEventListener('submit', handleForm);
