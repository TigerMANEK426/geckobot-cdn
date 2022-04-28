!async function() {

  try {

    ///
    /// DOM Control
    ///

    var dropdownOpenCancel = false;

    id('menu-dropdown-click').addEventListener('click', function(event) {
      !function handleEvent(e) {
        let dropdown = id('menu-dropdown-content');
        if (!dropdown.classList.contains('show')) {
  		  dropdownOpenCancel = true;
          dropdown.style.display = 'block';
          dropdown.style.opacity = 0;
          dropdown.classList.add('show');
          setTimeout(() => {
            dropdown.style.opacity = 1;
          }, 100);
        } else {
          dropdown.style.opacity = 0;
          dropdown.classList.remove('show');
          setTimeout(() => {
            dropdown.style.display = 'none';
  			 setTimeout(() => { dropdownOpenCancel = false }, 500);
          }, 350);
        }
      }(event);
    });

    d.addEventListener('click', function(event) {
      !function handleEvent(e) {
        let mdc = id('menu-dropdown-click');
        let dropdown = id('menu-dropdown-content');
        if (!dropdown.contains(e.target) && e.target.getAttribute('id') != 'menu-dropdown-click' && e.target.getAttribute('id') != 'menu-avatar' && e.target.getAttribute('id') != 'menu-dropdown-content' && dropdown.classList.contains('show')) {
          dropdown.style.opacity = 0;
          dropdown.classList.remove('show');
          setTimeout(() => {
            dropdown.style.display = 'none';
          }, 350);
        }
      }(event);
    });

    async function handleDataUrls() {
      var dataUrls = document.querySelectorAll('[data-url]');
      dataUrls.forEach((x, i) => {
        x.addEventListener('click', () => {
          var z = JSON.parse(x.getAttribute('data-url'));
          if (x.hasAttribute('data-new')) {
            window.location.href = z.url;
          } else {
            window.history.pushState({ title: z.title }, z.title + ' - Gecko-Bot', z.url);
            document.getElementsByTagName('title')[0].innerHTML = z.title + ' - Gecko-Bot';
          }
        })
      });
    };
    handleDataUrls();

    id('menu__icon').addEventListener('click', () => {
      document.querySelectorAll('nav.navigation ul.items')[0].classList.toggle('open');
    });

    id('user-login').addEventListener('click', () => {
      var w = window.open('/login');
      var i = setInterval(() => {
        if (w.closed) {
          clearInterval(i);
          try {
            const user = http.get('/api/authenticated', {
              headers: new Headers({
                  'Accept'       : 'application/json',
                  'Content-Type' : 'application/x-www-form-urlencoded',
              })
            }).json();

            if (user.success == true) {
              id('user-login').style.display = 'none';
              id('menu-dropdown-click').innerHTML = '<img class="profile" src="' + user.avatar + '" alt="" id="menu-avatar" /> ' + user.username;
              id('menu-dropdown-click').style.display = 'block';
            } else {
              return false;
            }
            id('menu-login-alt-user').style.display = 'block';
          } catch (e) {
            error.new(e);
          }
        }
      }, 500);
    });

    ///
    /// Handles the page request, including URL changes from history.pushState();
    ///

    try {
      const user = await (await fetch('/api/authenticated', {
        headers: new Headers({
            'Accept'       : 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded',
        })
      })).json();

      if (user.success == true) {
        id('user-login').style.display = 'none';
        id('menu-dropdown-click').innerHTML = '<img class="profile" src="' + user.avatar + '" alt="" id="menu-avatar" /> ' + user.username;
        id('menu-dropdown-click').style.display = 'block';
      }
      id('menu-login-alt-user').style.display = 'block';
    } catch (e) {
      error.new(e);
    }

  !async function render() {
      if (window.$customLoader == true) return;
      async function loadPage(path, first = false) {
        if (path == '/servers') {
          window.location.href = '/servers';
          return;
        }
        try {
          const authKey = '8CU2NR-5EU6QW-XTSOK0-QKVX9I-EYQU35-Q7U7JF-39O7Y5-JSPT2Q';
          const page = await (await fetch(path + '?__auth=' + authKey, {
            headers: {
                "Accept"       : "application/json",
                "Content-Type" : "application/x-www-form-urlencoded",
                "X-User-Agent"   : "UA-GECKOBOT-PAGE-REQUEST"
            }
          })).text();

          if ( first == true ) {
            id('page-content').innerHTML = page;
            id('page-content').style.display = 'block';
            setTimeout(() => {
              id('page-loader').style.opacity = 0;
              id('page-content').style.opacity = 1;
              setTimeout(() => {
                id('page-loader').style.display = 'none';
              }, 500);
              handleDataUrls();
            }, 500);
          } else {
            id('page-content').innerHTML = page;
            handleDataUrls();
          }
        } catch (e) {
          error.new(e);
        }
      };
      await loadPage('/', true);

      let path = window.location.pathname;
      setInterval(async () => {
        if (window.location.pathname == path) return false;
        path = window.location.pathname;
        await loadPage(window.location.pathname, false);
      }, 500);

    }();
    window.addEventListener('error', error.new);
  } catch (err) {
    error.new(err);
  }
}();
