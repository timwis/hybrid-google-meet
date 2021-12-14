const queries = {
  loadingIndicator: "//div[text()='Getting ready...']",
  joinBtn: "//div[@role='button'][descendant::text()='Join now'][not(@aria-disabled)]",
  presentBtn: "//div[@role='button'][descendant::text()='Present']",
  presentLabel: "//span[text()='Present']/text()",
  micBtn: "button[aria-label*='microphone']" // DOMString
}

// Add 'Join Hybrid' button
window.onload = function () {
  const loadingIndicator = getElementByXPath(queries.loadingIndicator)

  if (loadingIndicator) {
    const loadingObserver = new MutationObserver(function (mutationList, observer) {
      // Imperfect method of determining when DOM patching is finished
      const joinBtn = getElementByXPath(queries.joinBtn)
      if (isVisible(joinBtn)) {
        setTimeout(addJoinHybridBtn, 500) // Wait for animation to finish
        observer.disconnect()
      }
    })
    loadingObserver.observe(loadingIndicator.parentElement, { childList: true, subtree: true })
  }
}

function watchAndRemoveAudioElements () {
  const audioObserver = new MutationObserver(function (mutationList, observer) {
    const audioEls = document.getElementsByTagName('audio')
    if (audioEls.length > 0) {
      Array.from(audioEls).forEach((el) => el.remove())
    }
  })

  audioObserver.observe(document.body, { childList: true })
}

function watchAndMuteMicrophone () {
  // When mic button appears (in document.body), start watching it for changes to data-is-muted attribute
  const micBtnPresenceObserver = new MutationObserver(function (mutationList, observer) {
    const micBtn = document.querySelector(queries.micBtn)

    if (micBtn) {
      if (micBtn.dataset.isMuted !== 'true') {
        micBtn.click()
      }

      micBtnAttributeObserver.observe(micBtn, { attributes: true, attributeFilter: ['data-is-muted'] })
      observer.disconnect()
    }
  })

  micBtnPresenceObserver.observe(document.body, { subtree: true, childList: true })

  // When data-is-muted attribute changes, click mic button to mute it again
  const micBtnAttributeObserver = new MutationObserver(function (mutationList, observer) {
    const micBtn = mutationList[0].target
    if (micBtn.dataset.isMuted !== 'true') {
      micBtn.click()
    }
  })
}

function addJoinHybridBtn () {
  const joinBtn = getElementByXPath(queries.joinBtn)
  const presentBtn = getElementByXPath(queries.presentBtn)
  const joinBtnContainer = joinBtn.parentElement

  const hybridBtn = presentBtn.cloneNode(true)
  hybridBtn.removeAttribute('jsname') // leave jscontroller and jsaction to enable click animation
  hybridBtn.setAttribute('id', 'join-hybrid-btn')
  hybridBtn.setAttribute('data-tooltip', 'Join with audio and microphone disabled')
  hybridBtn.querySelector('.google-material-icons').innerText = 'mic_off'

  const label = getElementByXPath(queries.presentLabel, hybridBtn)
  label.textContent = 'Join hybrid'

  hybridBtn.onclick = function (event) {
    watchAndRemoveAudioElements()
    watchAndMuteMicrophone()
    joinBtn.click()
  }

  joinBtnContainer.appendChild(hybridBtn)
}

function getElementByXPath(xpath, context=document) {
  return document.evaluate(xpath, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}

function isVisible (el) {
  return el && el.clientWidth > 0
}
