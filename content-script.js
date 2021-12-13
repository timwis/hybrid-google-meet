// Add 'Join Hybrid' button
const loadingIndicatorQuery = "//div[text()='Getting ready...']"
const joinBtnQuery = "//div[@role='button'][descendant::text()='Join now'][not(@aria-disabled)]"
const loadingIndicator = getElementByXPath(loadingIndicatorQuery)

if (loadingIndicator) {
  const loadingObserver = new MutationObserver(function (mutationList, observer) {
    if (!getElementByXPath(loadingIndicatorQuery)) {
      // Wait for animation to finish
      setTimeout(() => {
        addJoinHybridBtn()
      }, 500)
      observer.disconnect()
    }
  })
  loadingObserver.observe(loadingIndicator.parentElement, { childList: true, subtree: true })
}

// Remove <audio> elements
const audioObserver = new MutationObserver(function (mutationList, observer) {
  const audioEls = document.getElementsByTagName('audio')
  if (audioEls.length > 0) {
    Array.from(audioEls).forEach((el) => el.remove())
  }
})

audioObserver.observe(document.body, { childList: true })

// Keep microphone button muted
const micBtnPresenceObserver = new MutationObserver(function (mutationList, observer) {
  const micBtn = document.querySelector('button[aria-label*="microphone"]')

  if (micBtn) {
    if (micBtn.dataset.isMuted !== 'true') {
      micBtn.click()
    }

    micBtnAttributeObserver.observe(micBtn, { attributes: true, attributeFilter: ['data-is-muted'] })
    observer.disconnect()
  }
})

micBtnPresenceObserver.observe(document.body, { subtree: true, childList: true })

const micBtnAttributeObserver = new MutationObserver(function (mutationList, observer) {
  const micBtn = mutationList[0].target
  if (micBtn.dataset.isMuted !== 'true') {
    micBtn.click()
  }
})

function addJoinHybridBtn () {
  const joinBtn = getElementByXPath("//div[@role='button'][descendant::text()='Join now']")
  const presentBtn = getElementByXPath("//div[@role='button'][descendant::text()='Present']")
  const joinBtnContainer = joinBtn.parentElement

  const hybridBtn = presentBtn.cloneNode(true)
  hybridBtn.removeAttribute('jsname') // leave jscontroller and jsaction to enable click animation
  hybridBtn.setAttribute('id', 'join-hybrid-btn')
  hybridBtn.querySelector('.google-material-icons').innerText = 'mic_off'

  const label = getElementByXPath("//span[text()='Present']/text()", hybridBtn)
  label.textContent = 'Join hybrid'

  joinBtnContainer.appendChild(hybridBtn)
}

function getElementByXPath(xpath, context=document) {
  return document.evaluate(xpath, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}
