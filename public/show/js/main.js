let messagesRef = db.collection('message');
let wishes = []
let playList = []
let showedId = []
let isShowing = false;
let isInitial = true;
let isFullScreen = false;
let fullscreenbtn = document.getElementById('fullscreenmode')
document.addEventListener("fullscreenchange", (event) => {
  if (!isFullScreen) {
    isFullScreen = true
    fullscreenbtn.style.display = 'none'
  } else {
    isFullScreen = false
    fullscreenbtn.style.display = 'initial'
  }
})
messagesRef.onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type == 'added') {
      syncDataFromFirebase()
    } else if (change.type == 'modified') {
      syncDataFromFirebase()
    } else if (change.type == 'removed') {
      console.log('Item removed')
    }
  })
})

$(document).ready(function () {
  var canvasC = document.getElementById('c');
  const confettiSetting = { target: 'confetti' };
  const confetti = new window.ConfettiGenerator(confettiSetting);
  confetti.render();
  canvasC.style.display = 'initial'
  syncDataFromFirebase();

  fullscreenbtn.addEventListener('click', fullscreen, false)
})
const syncDataFromFirebase = async (doc) => {
  console.log('Get data from Firebase...')
  const data = await messagesRef.where('status', '==', true).get();
  if (data.docs.length > 0 && data.docs.length > wishes.length) {
    data.docs.forEach(doc => {
      if (!wishes.includes(doc)) {
        wishes.push(doc)
        playList.push(doc)
      }
    })
    if (isInitial) {
      showGifbox()
    } else if (!isShowing) {
      showWishingMessage()
    }
  }
}

function fullscreen() {
  if (!isFullScreen) {
    fullscreenOn();
  }
}

function fullscreenOn() {
  var elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

function showWishingMessage() {
  if (playList.length)
    if (playList.length > 0) {
      let index = Math.floor(Math.random() * playList.length)
      const doc = playList[index]
      const wishContent = document.getElementById("content")
      const wishName = document.getElementById("name")
      wishContent.innerHTML = doc.data().message.replace(/\n/g, '<br>');
      wishName.textContent = doc.data().name;
      console.log(wishContent)
      console.log("showing... ", wishContent.textContent)
      var text = $('.split');
      var split = new SplitText(text);

      function random(min, max) {
        return (Math.random() * (max - min)) + min;
      }
      $(split.chars).each(function (i) {
        isShowing = true
        TweenMax.from($(this), 3.5, {
          opacity: 0,
          x: random(-1500, 1500),
          y: random(-1500, 1500),
          z: random(-1500, 1500),
          scale: .2,
          delay: i * .01,
          yoyo: true,
          repeat: 1,
          repeatDelay: 1,
          onComplete: () => {
            if (i === split.chars.length - 1) {
              updateShowCount(doc)
              // Remove showed of playlist
              playList.splice(playList.indexOf(doc), 1)
              if (playList.length == 0) {
                resetPlaylist()
              }
              isShowing = false
              showWishingMessage()
            }
          }
        })
      });
    }
}
// Reset Playlist to show wish again
function resetPlaylist() {
  console.log('Reset playlist and show again')
  wishes.forEach(wish => {
    playList.push(wish)
  })
  showedId = []
}
// Update count message to Firebase
function updateShowCount(doc) {
  showedId.push(doc.id)
}

//Show Gifbox
function showGifbox() {
  console.log('Show gifbox')

  let merrywrap = document.getElementById('merrywrap')
  merrywrap.style.display = 'initial'
  let gifbox = merrywrap.getElementsByClassName('giftbox')[0]
  let step = 1
  let stepMinutes = [2000, 2000, 1000, 1000]

  function init() {
    gifbox.addEventListener('click', openBox, false)
    isInitial = false
  }

  function stepClass(step) {
    merrywrap.className = 'merrywrap';
    merrywrap.className = 'merrywrap step-' + step
  }

  function openBox() {
    if (step === 1) {
      gifbox.removeEventListener('click', openBox, false)
    }
    stepClass(step)
    if (step === 3) { }
    if (step === 4) {
      showWishingMessage()
      return
    }
    setTimeout(openBox, stepMinutes[step - 1])
    step++
  }
  init()
}
