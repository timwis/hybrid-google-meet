const audioObserver = new MutationObserver(function (mutationList, observer) {
  const audioEls = document.getElementsByTagName('audio')
  if (audioEls.length > 0) {
    Array.from(audioEls).forEach((el) => el.remove())
  }
})

audioObserver.observe(document.body, { childList: true })

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
