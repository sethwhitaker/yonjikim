#
# Name    : wow
# Author  : Matthieu Aussaguel, http://mynameismatthieu.com/, @mattaussaguel
# Version : 0.1.12
# Repo    : https://github.com/matthieua/WOW
# Website : http://mynameismatthieu.com/wow
#


class Util
  extend: (custom, defaults) ->
    for key, value of custom
      defaults[key] = value if value?
    defaults

  isMobile: (agent) ->
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent)

# Minimalistic WeakMap shim, just in case.
WeakMap = @WeakMap or @MozWeakMap or \
  class WeakMap
    constructor: ->
      @keys   = []
      @values = []

    get: (key) ->
      for item, i in @keys
        if item is key
          return @values[i]

    set: (key, value) ->
      for item, i in @keys
        if item is key
          @values[i] = value
          return
      @keys.push(key)
      @values.push(value)

# Dummy MutationObserver, to avoid raising exceptions.
MutationObserver = @MutationObserver or @WebkitMutationObserver or @MozMutationObserver or \
  class MutationObserver
    constructor: ->
      console.warn 'MutationObserver is not supported by your browser.'
      console.warn 'WOW.js cannot detect dom mutations, please call .sync() after loading new content.'

    @notSupported: true

    observe: ->

class @WOW
  defaults:
    boxClass:     'wow'
    animateClass: 'animated'
    offset:       0
    mobile:       true
    live:         true

  constructor: (options = {}) ->
    @scrolled = true
    @config   = @util().extend(options, @defaults)
    # Map of elements to animation names:
    @animationNameCache = new WeakMap()

  init: ->
    @element = window.document.documentElement
    if document.readyState in ["interactive", "complete"]
      @start()
    else
      document.addEventListener 'DOMContentLoaded', @start
    @finished = []

  start: =>
    @stopped = false
    @boxes = @element.getElementsByClassName(@config.boxClass)
    @all = (box for box in @boxes)
    if @boxes.length
      if @disabled()
        @resetStyle()
      else
        @applyStyle(box, true) for box in @boxes
        window.addEventListener('scroll', @scrollHandler, false)
        window.addEventListener('resize', @scrollHandler, false)
        @interval = setInterval @scrollCallback, 50
    if @config.live
      new MutationObserver (records) =>
        for record in records
          @doSync(node) for node in record.addedNodes or []
      .observe document.body,
        childList: true
        subtree: true

  # unbind the scroll event
  stop: ->
    @stopped = true
    window.removeEventListener('scroll', @scrollHandler, false)
    window.removeEventListener('resize', @scrollHandler, false)
    clearInterval @interval if @interval?

  sync: (element) ->
    @doSync(@element) if MutationObserver.notSupported

  doSync: (element) ->
    unless @stopped
      element ||= @element
      element = element.parentNode or element
      for box in element.getElementsByClassName(@config.boxClass)
        unless box in @all
          @applyStyle(box, true)
          @boxes.push box
          @all.push box
          @scrolled = true

  # show box element
  show: (box) ->
    @applyStyle(box)
    box.className = "#{box.className} #{@config.animateClass}"

  applyStyle: (box, hidden) ->
    duration  = box.getAttribute('data-wow-duration')
    delay     = box.getAttribute('data-wow-delay')
    iteration = box.getAttribute('data-wow-iteration')

    @animate => @customStyle(box, hidden, duration, delay, iteration)

  animate: (->
    if 'requestAnimationFrame' of window
      (callback) ->
        window.requestAnimationFrame callback
    else
      (callback) ->
        callback()
  )()

  resetStyle: ->
    box.setAttribute('style', 'visibility: visible;') for box in @boxes

  customStyle: (box, hidden, duration, delay, iteration) ->
    @cacheAnimationName(box) if hidden
    box.style.visibility = if hidden then 'hidden' else 'visible'

    @vendorSet box.style, animationDuration: duration if duration
    @vendorSet box.style, animationDelay: delay if delay
    @vendorSet box.style, animationIterationCount: iteration if iteration
    @vendorSet box.style, animationName: if hidden then 'none' else @cachedAnimationName(box)

    box

  vendors: ["moz", "webkit"]
  vendorSet: (elem, properties) ->
    for name, value of properties
      elem["#{name}"] = value
      elem["#{vendor}#{name.charAt(0).toUpperCase()}#{name.substr 1}"] = value for vendor in @vendors
  vendorCSS: (elem, property) ->
    style = window.getComputedStyle(elem)
    result = style.getPropertyCSSValue(property)
    result = result or style.getPropertyCSSValue("-#{vendor}-#{property}") for vendor in @vendors
    result

  animationName: (box) ->
    try
      animationName = @vendorCSS(box, 'animation-name').cssText
    catch # Opera, fall back to plain property value
      animationName = window.getComputedStyle(box).getPropertyValue('animation-name')
    if animationName is 'none'
      ''  # SVG/Firefox, unable to get animation name?
    else
      animationName

  cacheAnimationName: (box) ->
    # https://bugzilla.mozilla.org/show_bug.cgi?id=921834
    # box.dataset is not supported for SVG elements in Firefox
    @animationNameCache.set(box, @animationName(box))
  cachedAnimationName: (box) ->
    @animationNameCache.get(box)

  # fast window.scroll callback
  scrollHandler: =>
    @scrolled = true

  scrollCallback: =>
    if @scrolled
      @scrolled = false
      @boxes = for box in @boxes when box
        if @isVisible(box)
          @show(box)
          continue
        box
      @stop() unless @boxes.length or @config.live


  # Calculate element offset top
  offsetTop: (element) ->
    # SVG elements don't have an offsetTop in Firefox.
    # This will use their nearest parent that has an offsetTop.
    # Also, using ('offsetTop' of element) causes an exception in Firefox.
    element = element.parentNode while element.offsetTop is undefined
    top = element.offsetTop
    top += element.offsetTop while element = element.offsetParent
    top

  # check if box is visible
  isVisible: (box) ->
    offset     = box.getAttribute('data-wow-offset') or @config.offset
    viewTop    = window.pageYOffset
    viewBottom = viewTop + @element.clientHeight - offset
    top        = @offsetTop(box)
    bottom     = top + box.clientHeight

    top <= viewBottom and bottom >= viewTop

  util: ->
    @_util ||= new Util()

  disabled: ->
    not @config.mobile and @util().isMobile(navigator.userAgent)