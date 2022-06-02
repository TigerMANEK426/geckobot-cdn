!async function render() {

  window.$customLoader = true;

  const x = setInterval(async () => {
    var fact = await (await http.get('https://uselessfacts.jsph.pl/random.json?language=en')).text;
    id('rf-inner').innerHTML = fact;
  }, 10000);

  var path = window.location.pathname;
  if (path !== '/servers') {

  }

  /*
   * Loads the requsted Guild by its ID, showing all settings for that Guild.
   */

  const loadGuild = async (guildId) => {

    const guild = await http.get('/api/local/loadGuild?id=' + guildId);

    if (guild.success == true) {
      id('guild--guild-icon').src = guild.iconUrl;
      id('guild--guild-name').innerHTML = guild.name + ' <small style="color:rgb(109, 118, 122)">(' + guild.userStatus + ')</small>';
      id('guild--nav-guild-name').innerHTML = 'Manage ' + guild.name;
      id('guild--guild-member-count').innerHTML = guild.memberCount + ' Members';
    } else {
      error.new(guild.code + ': ' + guild.message);
    }

    return true;
  }

  /*
   * Loads the list of Guilds that the user & bot is in where the user has either ADMINISTRATOR or MANAGE_GUILD Permissions
   */

  const loadGuildList = async () => {

    const response = await http.get('/api/local/guilds');
    const guilds = response.guilds;

    if (response.success == true) {

      id('guild-list').innerHTML = '';
      id('guild-list').insertAdjacentHTML( 'beforeend', '<h2>My Servers</h2><br>' );

      for (var i = 0; i < guilds.length; i++) {

        var html = sprintf(`<div class="row">
          <div class="icon">
            <img src="%s" alt="" draggable="false" />
          </div>
          <div class="info">
            <h2>%s</h2>
            <h4>%s Members</h4>
          </div>
          <div class="opts">
            <button class="standard" data-load="%s">Manage</button>
          </div>
        </div>`, guilds[i].icon, guilds[i].name, guilds[i].memberCount, guilds[i].id);

        id('guild-list').insertAdjacentHTML( 'beforeend', html );

      }
    } else {
      if (response.code == 400) {
        window.location.href = '/servers';
      } else {
        error.new(response.code + ': ' + response.message);
      }
    }
  };

  if (window.location.pathname == '/servers.php') {
    window.history.pushState('', {}, '/servers');
  }
  if (window.location.pathname == '/servers' || window.location.pathname == '/servers/') {

    await loadGuildList();

  } else {

    id('guild-list').style.display = 'none';

    var guildId = window.location.pathname.replace('/servers/', '');
    await loadGuild(guildId);
    id('guild--guild').style.display = 'block';
  }

  const dataLoaders = async () => {
    var dataLoaderUrls = document.querySelectorAll('[data-load]');
    dataLoaderUrls.forEach((x, i) => {
      x.addEventListener('click', async () => {
        x.innerHTML = '<i class="fas fa-cog fa-spin"></i> Manage';
        await loadGuild(x.getAttribute('data-load'));
        id('guild-list').style.display = 'none';
        document.body.style.paddingTop = '0';
        id('guild--guild').style.display = 'block';
        window.history.pushState('', {}, '/servers/' + x.getAttribute('data-load'));
        x.innerHTML = 'Manage';
      });
    });
  }
  dataLoaders();

  id('page-content').style.display = 'block';
  setTimeout(() => {
    clearInterval(x);
    id('page-loader').style.opacity = 0;
    id('random-fact').style.opacity = 0;
    id('page-content').style.opacity = 1;
    setTimeout(() => {
      id('page-loader').style.display = 'none';
    }, 500);
  }, 500);

  id('guild--to-guild-list').addEventListener('click', async (e) => {
    e.preventDefault();
    document.querySelector('nav.location').insertAdjacentHTML('afterbegin', '<span id="guild--nav-loc-loading-text">Loading...<br></span>');
    window.history.pushState('', {}, '/servers');
    await loadGuildList();
    await dataLoaders();
    id('guild--guild').style.display = 'none';
    id('guild-list').style.display = 'block';
    id('guild--nav-loc-loading-text').remove();
  });

  id('guild--open-cat-menu').addEventListener('click', (e) => {
    e.preventDefault();
    if (id('guild--section-tabs').classList.contains('open')) {
      id('guild--open-cat-menu').innerHTML = 'Open Menu';
    } else {
      id('guild--open-cat-menu').innerHTML = 'Close Menu';
    }
    id('guild--section-tabs').classList.toggle('open');
  });
  id('guild--guild-cat-menu-inner-close').addEventListener('click', () => {
    id('guild--open-cat-menu').innerHTML = 'Open Menu';
    id('guild--section-tabs').classList.remove('open');
  });


  var tabs = document.querySelectorAll('div.guild div.tabs ul.items li.item[data-sn-click]');
  var sections = document.querySelectorAll('div.guild div.content div.commands div.section[data-sn]');

  tabs.forEach((elmt, i) => {
    elmt.addEventListener('click', () => {
      try {
        tabs.forEach((elmt2, i) => {
          elmt2.classList.remove('active');
        });
        elmt.classList.add('active');
        var dataSnClick = elmt.getAttribute('data-sn-click');
        if (dataSnClick == 'overview') {
          id('guild--guild-info').style.display = 'block';
        } else {
          id('guild--guild-info').style.display = 'none';
        }
        sections.forEach((elmt3, i) => {
          elmt3.style.display = 'none';
        });
        document.querySelector('div.guild div.content div.commands div.section[data-sn=' + dataSnClick + ']').style.display = 'block';
      } catch {
        sections.forEach((elmt3, i) => {
          elmt3.style.display = 'none';
        });
        document.querySelector('div.guild div.content div.commands div.section[data-sn=404-page').style.display = 'block';
      }
    });
  });
  document.querySelector('div.guild div.tabs ul.items li.item[data-sn-click=overview]').click();
}();
