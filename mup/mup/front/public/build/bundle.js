
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function getAugmentedNamespace(n) {
      if (n.__esModule) return n;
      var f = n.default;
    	if (typeof f == "function") {
    		var a = function a () {
    			if (this instanceof a) {
    				var args = [null];
    				args.push.apply(args, arguments);
    				var Ctor = Function.bind.apply(f, args);
    				return new Ctor();
    			}
    			return f.apply(this, arguments);
    		};
    		a.prototype = f.prototype;
      } else a = {};
      Object.defineProperty(a, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    var sha256$1 = {exports: {}};

    var _nodeResolve_empty = {};

    var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        default: _nodeResolve_empty
    });

    var require$$1 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

    /**
     * [js-sha256]{@link https://github.com/emn178/js-sha256}
     *
     * @version 0.11.0
     * @author Chen, Yi-Cyuan [emn178@gmail.com]
     * @copyright Chen, Yi-Cyuan 2014-2024
     * @license MIT
     */

    (function (module) {
    	/*jslint bitwise: true */
    	(function () {

    	  var ERROR = 'input is invalid type';
    	  var WINDOW = typeof window === 'object';
    	  var root = WINDOW ? window : {};
    	  if (root.JS_SHA256_NO_WINDOW) {
    	    WINDOW = false;
    	  }
    	  var WEB_WORKER = !WINDOW && typeof self === 'object';
    	  var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
    	  if (NODE_JS) {
    	    root = commonjsGlobal;
    	  } else if (WEB_WORKER) {
    	    root = self;
    	  }
    	  var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && 'object' === 'object' && module.exports;
    	  var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
    	  var HEX_CHARS = '0123456789abcdef'.split('');
    	  var EXTRA = [-2147483648, 8388608, 32768, 128];
    	  var SHIFT = [24, 16, 8, 0];
    	  var K = [
    	    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    	    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    	    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    	    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    	    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    	    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    	    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    	    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    	  ];
    	  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

    	  var blocks = [];

    	  if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
    	    Array.isArray = function (obj) {
    	      return Object.prototype.toString.call(obj) === '[object Array]';
    	    };
    	  }

    	  if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    	    ArrayBuffer.isView = function (obj) {
    	      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    	    };
    	  }

    	  var createOutputMethod = function (outputType, is224) {
    	    return function (message) {
    	      return new Sha256(is224, true).update(message)[outputType]();
    	    };
    	  };

    	  var createMethod = function (is224) {
    	    var method = createOutputMethod('hex', is224);
    	    if (NODE_JS) {
    	      method = nodeWrap(method, is224);
    	    }
    	    method.create = function () {
    	      return new Sha256(is224);
    	    };
    	    method.update = function (message) {
    	      return method.create().update(message);
    	    };
    	    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
    	      var type = OUTPUT_TYPES[i];
    	      method[type] = createOutputMethod(type, is224);
    	    }
    	    return method;
    	  };

    	  var nodeWrap = function (method, is224) {
    	    var crypto = require$$1;
    	    var Buffer = require$$1.Buffer;
    	    var algorithm = is224 ? 'sha224' : 'sha256';
    	    var bufferFrom;
    	    if (Buffer.from && !root.JS_SHA256_NO_BUFFER_FROM) {
    	      bufferFrom = Buffer.from;
    	    } else {
    	      bufferFrom = function (message) {
    	        return new Buffer(message);
    	      };
    	    }
    	    var nodeMethod = function (message) {
    	      if (typeof message === 'string') {
    	        return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
    	      } else {
    	        if (message === null || message === undefined) {
    	          throw new Error(ERROR);
    	        } else if (message.constructor === ArrayBuffer) {
    	          message = new Uint8Array(message);
    	        }
    	      }
    	      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
    	        message.constructor === Buffer) {
    	        return crypto.createHash(algorithm).update(bufferFrom(message)).digest('hex');
    	      } else {
    	        return method(message);
    	      }
    	    };
    	    return nodeMethod;
    	  };

    	  var createHmacOutputMethod = function (outputType, is224) {
    	    return function (key, message) {
    	      return new HmacSha256(key, is224, true).update(message)[outputType]();
    	    };
    	  };

    	  var createHmacMethod = function (is224) {
    	    var method = createHmacOutputMethod('hex', is224);
    	    method.create = function (key) {
    	      return new HmacSha256(key, is224);
    	    };
    	    method.update = function (key, message) {
    	      return method.create(key).update(message);
    	    };
    	    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
    	      var type = OUTPUT_TYPES[i];
    	      method[type] = createHmacOutputMethod(type, is224);
    	    }
    	    return method;
    	  };

    	  function Sha256(is224, sharedMemory) {
    	    if (sharedMemory) {
    	      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
    	        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
    	        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
    	        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    	      this.blocks = blocks;
    	    } else {
    	      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    	    }

    	    if (is224) {
    	      this.h0 = 0xc1059ed8;
    	      this.h1 = 0x367cd507;
    	      this.h2 = 0x3070dd17;
    	      this.h3 = 0xf70e5939;
    	      this.h4 = 0xffc00b31;
    	      this.h5 = 0x68581511;
    	      this.h6 = 0x64f98fa7;
    	      this.h7 = 0xbefa4fa4;
    	    } else { // 256
    	      this.h0 = 0x6a09e667;
    	      this.h1 = 0xbb67ae85;
    	      this.h2 = 0x3c6ef372;
    	      this.h3 = 0xa54ff53a;
    	      this.h4 = 0x510e527f;
    	      this.h5 = 0x9b05688c;
    	      this.h6 = 0x1f83d9ab;
    	      this.h7 = 0x5be0cd19;
    	    }

    	    this.block = this.start = this.bytes = this.hBytes = 0;
    	    this.finalized = this.hashed = false;
    	    this.first = true;
    	    this.is224 = is224;
    	  }

    	  Sha256.prototype.update = function (message) {
    	    if (this.finalized) {
    	      return;
    	    }
    	    var notString, type = typeof message;
    	    if (type !== 'string') {
    	      if (type === 'object') {
    	        if (message === null) {
    	          throw new Error(ERROR);
    	        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
    	          message = new Uint8Array(message);
    	        } else if (!Array.isArray(message)) {
    	          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
    	            throw new Error(ERROR);
    	          }
    	        }
    	      } else {
    	        throw new Error(ERROR);
    	      }
    	      notString = true;
    	    }
    	    var code, index = 0, i, length = message.length, blocks = this.blocks;
    	    while (index < length) {
    	      if (this.hashed) {
    	        this.hashed = false;
    	        blocks[0] = this.block;
    	        this.block = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
    	          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
    	          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
    	          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    	      }

    	      if (notString) {
    	        for (i = this.start; index < length && i < 64; ++index) {
    	          blocks[i >>> 2] |= message[index] << SHIFT[i++ & 3];
    	        }
    	      } else {
    	        for (i = this.start; index < length && i < 64; ++index) {
    	          code = message.charCodeAt(index);
    	          if (code < 0x80) {
    	            blocks[i >>> 2] |= code << SHIFT[i++ & 3];
    	          } else if (code < 0x800) {
    	            blocks[i >>> 2] |= (0xc0 | (code >>> 6)) << SHIFT[i++ & 3];
    	            blocks[i >>> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
    	          } else if (code < 0xd800 || code >= 0xe000) {
    	            blocks[i >>> 2] |= (0xe0 | (code >>> 12)) << SHIFT[i++ & 3];
    	            blocks[i >>> 2] |= (0x80 | ((code >>> 6) & 0x3f)) << SHIFT[i++ & 3];
    	            blocks[i >>> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
    	          } else {
    	            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
    	            blocks[i >>> 2] |= (0xf0 | (code >>> 18)) << SHIFT[i++ & 3];
    	            blocks[i >>> 2] |= (0x80 | ((code >>> 12) & 0x3f)) << SHIFT[i++ & 3];
    	            blocks[i >>> 2] |= (0x80 | ((code >>> 6) & 0x3f)) << SHIFT[i++ & 3];
    	            blocks[i >>> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
    	          }
    	        }
    	      }

    	      this.lastByteIndex = i;
    	      this.bytes += i - this.start;
    	      if (i >= 64) {
    	        this.block = blocks[16];
    	        this.start = i - 64;
    	        this.hash();
    	        this.hashed = true;
    	      } else {
    	        this.start = i;
    	      }
    	    }
    	    if (this.bytes > 4294967295) {
    	      this.hBytes += this.bytes / 4294967296 << 0;
    	      this.bytes = this.bytes % 4294967296;
    	    }
    	    return this;
    	  };

    	  Sha256.prototype.finalize = function () {
    	    if (this.finalized) {
    	      return;
    	    }
    	    this.finalized = true;
    	    var blocks = this.blocks, i = this.lastByteIndex;
    	    blocks[16] = this.block;
    	    blocks[i >>> 2] |= EXTRA[i & 3];
    	    this.block = blocks[16];
    	    if (i >= 56) {
    	      if (!this.hashed) {
    	        this.hash();
    	      }
    	      blocks[0] = this.block;
    	      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
    	        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
    	        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
    	        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    	    }
    	    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
    	    blocks[15] = this.bytes << 3;
    	    this.hash();
    	  };

    	  Sha256.prototype.hash = function () {
    	    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
    	      h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

    	    for (j = 16; j < 64; ++j) {
    	      // rightrotate
    	      t1 = blocks[j - 15];
    	      s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
    	      t1 = blocks[j - 2];
    	      s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
    	      blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
    	    }

    	    bc = b & c;
    	    for (j = 0; j < 64; j += 4) {
    	      if (this.first) {
    	        if (this.is224) {
    	          ab = 300032;
    	          t1 = blocks[0] - 1413257819;
    	          h = t1 - 150054599 << 0;
    	          d = t1 + 24177077 << 0;
    	        } else {
    	          ab = 704751109;
    	          t1 = blocks[0] - 210244248;
    	          h = t1 - 1521486534 << 0;
    	          d = t1 + 143694565 << 0;
    	        }
    	        this.first = false;
    	      } else {
    	        s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
    	        s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
    	        ab = a & b;
    	        maj = ab ^ (a & c) ^ bc;
    	        ch = (e & f) ^ (~e & g);
    	        t1 = h + s1 + ch + K[j] + blocks[j];
    	        t2 = s0 + maj;
    	        h = d + t1 << 0;
    	        d = t1 + t2 << 0;
    	      }
    	      s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
    	      s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
    	      da = d & a;
    	      maj = da ^ (d & b) ^ ab;
    	      ch = (h & e) ^ (~h & f);
    	      t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
    	      t2 = s0 + maj;
    	      g = c + t1 << 0;
    	      c = t1 + t2 << 0;
    	      s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
    	      s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
    	      cd = c & d;
    	      maj = cd ^ (c & a) ^ da;
    	      ch = (g & h) ^ (~g & e);
    	      t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
    	      t2 = s0 + maj;
    	      f = b + t1 << 0;
    	      b = t1 + t2 << 0;
    	      s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
    	      s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
    	      bc = b & c;
    	      maj = bc ^ (b & d) ^ cd;
    	      ch = (f & g) ^ (~f & h);
    	      t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
    	      t2 = s0 + maj;
    	      e = a + t1 << 0;
    	      a = t1 + t2 << 0;
    	      this.chromeBugWorkAround = true;
    	    }

    	    this.h0 = this.h0 + a << 0;
    	    this.h1 = this.h1 + b << 0;
    	    this.h2 = this.h2 + c << 0;
    	    this.h3 = this.h3 + d << 0;
    	    this.h4 = this.h4 + e << 0;
    	    this.h5 = this.h5 + f << 0;
    	    this.h6 = this.h6 + g << 0;
    	    this.h7 = this.h7 + h << 0;
    	  };

    	  Sha256.prototype.hex = function () {
    	    this.finalize();

    	    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
    	      h6 = this.h6, h7 = this.h7;

    	    var hex = HEX_CHARS[(h0 >>> 28) & 0x0F] + HEX_CHARS[(h0 >>> 24) & 0x0F] +
    	      HEX_CHARS[(h0 >>> 20) & 0x0F] + HEX_CHARS[(h0 >>> 16) & 0x0F] +
    	      HEX_CHARS[(h0 >>> 12) & 0x0F] + HEX_CHARS[(h0 >>> 8) & 0x0F] +
    	      HEX_CHARS[(h0 >>> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
    	      HEX_CHARS[(h1 >>> 28) & 0x0F] + HEX_CHARS[(h1 >>> 24) & 0x0F] +
    	      HEX_CHARS[(h1 >>> 20) & 0x0F] + HEX_CHARS[(h1 >>> 16) & 0x0F] +
    	      HEX_CHARS[(h1 >>> 12) & 0x0F] + HEX_CHARS[(h1 >>> 8) & 0x0F] +
    	      HEX_CHARS[(h1 >>> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
    	      HEX_CHARS[(h2 >>> 28) & 0x0F] + HEX_CHARS[(h2 >>> 24) & 0x0F] +
    	      HEX_CHARS[(h2 >>> 20) & 0x0F] + HEX_CHARS[(h2 >>> 16) & 0x0F] +
    	      HEX_CHARS[(h2 >>> 12) & 0x0F] + HEX_CHARS[(h2 >>> 8) & 0x0F] +
    	      HEX_CHARS[(h2 >>> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
    	      HEX_CHARS[(h3 >>> 28) & 0x0F] + HEX_CHARS[(h3 >>> 24) & 0x0F] +
    	      HEX_CHARS[(h3 >>> 20) & 0x0F] + HEX_CHARS[(h3 >>> 16) & 0x0F] +
    	      HEX_CHARS[(h3 >>> 12) & 0x0F] + HEX_CHARS[(h3 >>> 8) & 0x0F] +
    	      HEX_CHARS[(h3 >>> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
    	      HEX_CHARS[(h4 >>> 28) & 0x0F] + HEX_CHARS[(h4 >>> 24) & 0x0F] +
    	      HEX_CHARS[(h4 >>> 20) & 0x0F] + HEX_CHARS[(h4 >>> 16) & 0x0F] +
    	      HEX_CHARS[(h4 >>> 12) & 0x0F] + HEX_CHARS[(h4 >>> 8) & 0x0F] +
    	      HEX_CHARS[(h4 >>> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
    	      HEX_CHARS[(h5 >>> 28) & 0x0F] + HEX_CHARS[(h5 >>> 24) & 0x0F] +
    	      HEX_CHARS[(h5 >>> 20) & 0x0F] + HEX_CHARS[(h5 >>> 16) & 0x0F] +
    	      HEX_CHARS[(h5 >>> 12) & 0x0F] + HEX_CHARS[(h5 >>> 8) & 0x0F] +
    	      HEX_CHARS[(h5 >>> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
    	      HEX_CHARS[(h6 >>> 28) & 0x0F] + HEX_CHARS[(h6 >>> 24) & 0x0F] +
    	      HEX_CHARS[(h6 >>> 20) & 0x0F] + HEX_CHARS[(h6 >>> 16) & 0x0F] +
    	      HEX_CHARS[(h6 >>> 12) & 0x0F] + HEX_CHARS[(h6 >>> 8) & 0x0F] +
    	      HEX_CHARS[(h6 >>> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
    	    if (!this.is224) {
    	      hex += HEX_CHARS[(h7 >>> 28) & 0x0F] + HEX_CHARS[(h7 >>> 24) & 0x0F] +
    	        HEX_CHARS[(h7 >>> 20) & 0x0F] + HEX_CHARS[(h7 >>> 16) & 0x0F] +
    	        HEX_CHARS[(h7 >>> 12) & 0x0F] + HEX_CHARS[(h7 >>> 8) & 0x0F] +
    	        HEX_CHARS[(h7 >>> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
    	    }
    	    return hex;
    	  };

    	  Sha256.prototype.toString = Sha256.prototype.hex;

    	  Sha256.prototype.digest = function () {
    	    this.finalize();

    	    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
    	      h6 = this.h6, h7 = this.h7;

    	    var arr = [
    	      (h0 >>> 24) & 0xFF, (h0 >>> 16) & 0xFF, (h0 >>> 8) & 0xFF, h0 & 0xFF,
    	      (h1 >>> 24) & 0xFF, (h1 >>> 16) & 0xFF, (h1 >>> 8) & 0xFF, h1 & 0xFF,
    	      (h2 >>> 24) & 0xFF, (h2 >>> 16) & 0xFF, (h2 >>> 8) & 0xFF, h2 & 0xFF,
    	      (h3 >>> 24) & 0xFF, (h3 >>> 16) & 0xFF, (h3 >>> 8) & 0xFF, h3 & 0xFF,
    	      (h4 >>> 24) & 0xFF, (h4 >>> 16) & 0xFF, (h4 >>> 8) & 0xFF, h4 & 0xFF,
    	      (h5 >>> 24) & 0xFF, (h5 >>> 16) & 0xFF, (h5 >>> 8) & 0xFF, h5 & 0xFF,
    	      (h6 >>> 24) & 0xFF, (h6 >>> 16) & 0xFF, (h6 >>> 8) & 0xFF, h6 & 0xFF
    	    ];
    	    if (!this.is224) {
    	      arr.push((h7 >>> 24) & 0xFF, (h7 >>> 16) & 0xFF, (h7 >>> 8) & 0xFF, h7 & 0xFF);
    	    }
    	    return arr;
    	  };

    	  Sha256.prototype.array = Sha256.prototype.digest;

    	  Sha256.prototype.arrayBuffer = function () {
    	    this.finalize();

    	    var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
    	    var dataView = new DataView(buffer);
    	    dataView.setUint32(0, this.h0);
    	    dataView.setUint32(4, this.h1);
    	    dataView.setUint32(8, this.h2);
    	    dataView.setUint32(12, this.h3);
    	    dataView.setUint32(16, this.h4);
    	    dataView.setUint32(20, this.h5);
    	    dataView.setUint32(24, this.h6);
    	    if (!this.is224) {
    	      dataView.setUint32(28, this.h7);
    	    }
    	    return buffer;
    	  };

    	  function HmacSha256(key, is224, sharedMemory) {
    	    var i, type = typeof key;
    	    if (type === 'string') {
    	      var bytes = [], length = key.length, index = 0, code;
    	      for (i = 0; i < length; ++i) {
    	        code = key.charCodeAt(i);
    	        if (code < 0x80) {
    	          bytes[index++] = code;
    	        } else if (code < 0x800) {
    	          bytes[index++] = (0xc0 | (code >>> 6));
    	          bytes[index++] = (0x80 | (code & 0x3f));
    	        } else if (code < 0xd800 || code >= 0xe000) {
    	          bytes[index++] = (0xe0 | (code >>> 12));
    	          bytes[index++] = (0x80 | ((code >>> 6) & 0x3f));
    	          bytes[index++] = (0x80 | (code & 0x3f));
    	        } else {
    	          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
    	          bytes[index++] = (0xf0 | (code >>> 18));
    	          bytes[index++] = (0x80 | ((code >>> 12) & 0x3f));
    	          bytes[index++] = (0x80 | ((code >>> 6) & 0x3f));
    	          bytes[index++] = (0x80 | (code & 0x3f));
    	        }
    	      }
    	      key = bytes;
    	    } else {
    	      if (type === 'object') {
    	        if (key === null) {
    	          throw new Error(ERROR);
    	        } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
    	          key = new Uint8Array(key);
    	        } else if (!Array.isArray(key)) {
    	          if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
    	            throw new Error(ERROR);
    	          }
    	        }
    	      } else {
    	        throw new Error(ERROR);
    	      }
    	    }

    	    if (key.length > 64) {
    	      key = (new Sha256(is224, true)).update(key).array();
    	    }

    	    var oKeyPad = [], iKeyPad = [];
    	    for (i = 0; i < 64; ++i) {
    	      var b = key[i] || 0;
    	      oKeyPad[i] = 0x5c ^ b;
    	      iKeyPad[i] = 0x36 ^ b;
    	    }

    	    Sha256.call(this, is224, sharedMemory);

    	    this.update(iKeyPad);
    	    this.oKeyPad = oKeyPad;
    	    this.inner = true;
    	    this.sharedMemory = sharedMemory;
    	  }
    	  HmacSha256.prototype = new Sha256();

    	  HmacSha256.prototype.finalize = function () {
    	    Sha256.prototype.finalize.call(this);
    	    if (this.inner) {
    	      this.inner = false;
    	      var innerHash = this.array();
    	      Sha256.call(this, this.is224, this.sharedMemory);
    	      this.update(this.oKeyPad);
    	      this.update(innerHash);
    	      Sha256.prototype.finalize.call(this);
    	    }
    	  };

    	  var exports = createMethod();
    	  exports.sha256 = exports;
    	  exports.sha224 = createMethod(true);
    	  exports.sha256.hmac = createHmacMethod();
    	  exports.sha224.hmac = createHmacMethod(true);

    	  if (COMMON_JS) {
    	    module.exports = exports;
    	  } else {
    	    root.sha256 = exports.sha256;
    	    root.sha224 = exports.sha224;
    	  }
    	})(); 
    } (sha256$1));

    var sha256Exports = sha256$1.exports;
    var sha256 = /*@__PURE__*/getDefaultExportFromCjs(sha256Exports);

    class InvalidTokenError extends Error {
    }
    InvalidTokenError.prototype.name = "InvalidTokenError";
    function b64DecodeUnicode(str) {
        return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
            let code = p.charCodeAt(0).toString(16).toUpperCase();
            if (code.length < 2) {
                code = "0" + code;
            }
            return "%" + code;
        }));
    }
    function base64UrlDecode(str) {
        let output = str.replace(/-/g, "+").replace(/_/g, "/");
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += "==";
                break;
            case 3:
                output += "=";
                break;
            default:
                throw new Error("base64 string is not of the correct length");
        }
        try {
            return b64DecodeUnicode(output);
        }
        catch (err) {
            return atob(output);
        }
    }
    function jwtDecode(token, options) {
        if (typeof token !== "string") {
            throw new InvalidTokenError("Invalid token specified: must be a string");
        }
        options || (options = {});
        const pos = options.header === true ? 0 : 1;
        const part = token.split(".")[pos];
        if (typeof part !== "string") {
            throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
        }
        let decoded;
        try {
            decoded = base64UrlDecode(part);
        }
        catch (e) {
            throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
        }
        try {
            return JSON.parse(decoded);
        }
        catch (e) {
            throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
        }
    }

    /*
     * Copyright 2016 Red Hat, Inc. and/or its affiliates
     * and other contributors as indicated by the @author tags.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    if (typeof Promise === 'undefined') {
        throw Error('Keycloak requires an environment that supports Promises. Make sure that you include the appropriate polyfill.');
    }

    function Keycloak (config) {
        if (!(this instanceof Keycloak)) {
            throw new Error("The 'Keycloak' constructor must be invoked with 'new'.")
        }

        var kc = this;
        var adapter;
        var refreshQueue = [];
        var callbackStorage;

        var loginIframe = {
            enable: true,
            callbackList: [],
            interval: 5
        };

        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            if ((scripts[i].src.indexOf('keycloak.js') !== -1 || scripts[i].src.indexOf('keycloak.min.js') !== -1) && scripts[i].src.indexOf('version=') !== -1) {
                kc.iframeVersion = scripts[i].src.substring(scripts[i].src.indexOf('version=') + 8).split('&')[0];
            }
        }

        var useNonce = true;
        var logInfo = createLogger(console.info);
        var logWarn = createLogger(console.warn);

        kc.init = function (initOptions) {
            if (kc.didInitialize) {
                throw new Error("A 'Keycloak' instance can only be initialized once.");
            }

            kc.didInitialize = true;

            kc.authenticated = false;

            callbackStorage = createCallbackStorage();
            var adapters = ['default', 'cordova', 'cordova-native'];

            if (initOptions && adapters.indexOf(initOptions.adapter) > -1) {
                adapter = loadAdapter(initOptions.adapter);
            } else if (initOptions && typeof initOptions.adapter === "object") {
                adapter = initOptions.adapter;
            } else {
                if (window.Cordova || window.cordova) {
                    adapter = loadAdapter('cordova');
                } else {
                    adapter = loadAdapter();
                }
            }

            if (initOptions) {
                if (typeof initOptions.useNonce !== 'undefined') {
                    useNonce = initOptions.useNonce;
                }

                if (typeof initOptions.checkLoginIframe !== 'undefined') {
                    loginIframe.enable = initOptions.checkLoginIframe;
                }

                if (initOptions.checkLoginIframeInterval) {
                    loginIframe.interval = initOptions.checkLoginIframeInterval;
                }

                if (initOptions.onLoad === 'login-required') {
                    kc.loginRequired = true;
                }

                if (initOptions.responseMode) {
                    if (initOptions.responseMode === 'query' || initOptions.responseMode === 'fragment') {
                        kc.responseMode = initOptions.responseMode;
                    } else {
                        throw 'Invalid value for responseMode';
                    }
                }

                if (initOptions.flow) {
                    switch (initOptions.flow) {
                        case 'standard':
                            kc.responseType = 'code';
                            break;
                        case 'implicit':
                            kc.responseType = 'id_token token';
                            break;
                        case 'hybrid':
                            kc.responseType = 'code id_token token';
                            break;
                        default:
                            throw 'Invalid value for flow';
                    }
                    kc.flow = initOptions.flow;
                }

                if (initOptions.timeSkew != null) {
                    kc.timeSkew = initOptions.timeSkew;
                }

                if(initOptions.redirectUri) {
                    kc.redirectUri = initOptions.redirectUri;
                }

                if (initOptions.silentCheckSsoRedirectUri) {
                    kc.silentCheckSsoRedirectUri = initOptions.silentCheckSsoRedirectUri;
                }

                if (typeof initOptions.silentCheckSsoFallback === 'boolean') {
                    kc.silentCheckSsoFallback = initOptions.silentCheckSsoFallback;
                } else {
                    kc.silentCheckSsoFallback = true;
                }

                if (typeof initOptions.pkceMethod !== "undefined") {
                    if (initOptions.pkceMethod !== "S256" && initOptions.pkceMethod !== false) {
                        throw new TypeError(`Invalid value for pkceMethod', expected 'S256' or false but got ${initOptions.pkceMethod}.`);
                    }

                    kc.pkceMethod = initOptions.pkceMethod;
                } else {
                    kc.pkceMethod = "S256";
                }

                if (typeof initOptions.enableLogging === 'boolean') {
                    kc.enableLogging = initOptions.enableLogging;
                } else {
                    kc.enableLogging = false;
                }

                if (initOptions.logoutMethod === 'POST') {
                    kc.logoutMethod = 'POST';
                } else {
                    kc.logoutMethod = 'GET';
                }

                if (typeof initOptions.scope === 'string') {
                    kc.scope = initOptions.scope;
                }

                if (typeof initOptions.acrValues === 'string') {
                    kc.acrValues = initOptions.acrValues;
                }

                if (typeof initOptions.messageReceiveTimeout === 'number' && initOptions.messageReceiveTimeout > 0) {
                    kc.messageReceiveTimeout = initOptions.messageReceiveTimeout;
                } else {
                    kc.messageReceiveTimeout = 10000;
                }
            }

            if (!kc.responseMode) {
                kc.responseMode = 'fragment';
            }
            if (!kc.responseType) {
                kc.responseType = 'code';
                kc.flow = 'standard';
            }

            var promise = createPromise();

            var initPromise = createPromise();
            initPromise.promise.then(function() {
                kc.onReady && kc.onReady(kc.authenticated);
                promise.setSuccess(kc.authenticated);
            }).catch(function(error) {
                promise.setError(error);
            });

            var configPromise = loadConfig();

            function onLoad() {
                var doLogin = function(prompt) {
                    if (!prompt) {
                        options.prompt = 'none';
                    }

                    if (initOptions && initOptions.locale) {
                        options.locale = initOptions.locale;
                    }
                    kc.login(options).then(function () {
                        initPromise.setSuccess();
                    }).catch(function (error) {
                        initPromise.setError(error);
                    });
                };

                var checkSsoSilently = function() {
                    var ifrm = document.createElement("iframe");
                    var src = kc.createLoginUrl({prompt: 'none', redirectUri: kc.silentCheckSsoRedirectUri});
                    ifrm.setAttribute("src", src);
                    ifrm.setAttribute("sandbox", "allow-storage-access-by-user-activation allow-scripts allow-same-origin");
                    ifrm.setAttribute("title", "keycloak-silent-check-sso");
                    ifrm.style.display = "none";
                    document.body.appendChild(ifrm);

                    var messageCallback = function(event) {
                        if (event.origin !== window.location.origin || ifrm.contentWindow !== event.source) {
                            return;
                        }

                        var oauth = parseCallback(event.data);
                        processCallback(oauth, initPromise);

                        document.body.removeChild(ifrm);
                        window.removeEventListener("message", messageCallback);
                    };

                    window.addEventListener("message", messageCallback);
                };

                var options = {};
                switch (initOptions.onLoad) {
                    case 'check-sso':
                        if (loginIframe.enable) {
                            setupCheckLoginIframe().then(function() {
                                checkLoginIframe().then(function (unchanged) {
                                    if (!unchanged) {
                                        kc.silentCheckSsoRedirectUri ? checkSsoSilently() : doLogin(false);
                                    } else {
                                        initPromise.setSuccess();
                                    }
                                }).catch(function (error) {
                                    initPromise.setError(error);
                                });
                            });
                        } else {
                            kc.silentCheckSsoRedirectUri ? checkSsoSilently() : doLogin(false);
                        }
                        break;
                    case 'login-required':
                        doLogin(true);
                        break;
                    default:
                        throw 'Invalid value for onLoad';
                }
            }

            function processInit() {
                var callback = parseCallback(window.location.href);

                if (callback) {
                    window.history.replaceState(window.history.state, null, callback.newUrl);
                }

                if (callback && callback.valid) {
                    return setupCheckLoginIframe().then(function() {
                        processCallback(callback, initPromise);
                    }).catch(function (error) {
                        initPromise.setError(error);
                    });
                } else if (initOptions) {
                    if (initOptions.token && initOptions.refreshToken) {
                        setToken(initOptions.token, initOptions.refreshToken, initOptions.idToken);

                        if (loginIframe.enable) {
                            setupCheckLoginIframe().then(function() {
                                checkLoginIframe().then(function (unchanged) {
                                    if (unchanged) {
                                        kc.onAuthSuccess && kc.onAuthSuccess();
                                        initPromise.setSuccess();
                                        scheduleCheckIframe();
                                    } else {
                                        initPromise.setSuccess();
                                    }
                                }).catch(function (error) {
                                    initPromise.setError(error);
                                });
                            });
                        } else {
                            kc.updateToken(-1).then(function() {
                                kc.onAuthSuccess && kc.onAuthSuccess();
                                initPromise.setSuccess();
                            }).catch(function(error) {
                                kc.onAuthError && kc.onAuthError();
                                if (initOptions.onLoad) {
                                    onLoad();
                                } else {
                                    initPromise.setError(error);
                                }
                            });
                        }
                    } else if (initOptions.onLoad) {
                        onLoad();
                    } else {
                        initPromise.setSuccess();
                    }
                } else {
                    initPromise.setSuccess();
                }
            }

            function domReady() {
                var promise = createPromise();

                var checkReadyState = function () {
                    if (document.readyState === 'interactive' || document.readyState === 'complete') {
                        document.removeEventListener('readystatechange', checkReadyState);
                        promise.setSuccess();
                    }
                };
                document.addEventListener('readystatechange', checkReadyState);

                checkReadyState(); // just in case the event was already fired and we missed it (in case the init is done later than at the load time, i.e. it's done from code)

                return promise.promise;
            }

            configPromise.then(function () {
                domReady()
                    .then(check3pCookiesSupported)
                    .then(processInit)
                    .catch(function (error) {
                        promise.setError(error);
                    });
            });
            configPromise.catch(function (error) {
                promise.setError(error);
            });

            return promise.promise;
        };

        kc.login = function (options) {
            return adapter.login(options);
        };

        function generateRandomData(len) {
            // use web crypto APIs if possible
            var array = null;
            var crypto = window.crypto || window.msCrypto;
            if (crypto && crypto.getRandomValues && window.Uint8Array) {
                array = new Uint8Array(len);
                crypto.getRandomValues(array);
                return array;
            }

            // fallback to Math random
            array = new Array(len);
            for (var j = 0; j < array.length; j++) {
                array[j] = Math.floor(256 * Math.random());
            }
            return array;
        }

        function generateCodeVerifier(len) {
            return generateRandomString(len, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
        }

        function generateRandomString(len, alphabet){
            var randomData = generateRandomData(len);
            var chars = new Array(len);
            for (var i = 0; i < len; i++) {
                chars[i] = alphabet.charCodeAt(randomData[i] % alphabet.length);
            }
            return String.fromCharCode.apply(null, chars);
        }

        function generatePkceChallenge(pkceMethod, codeVerifier) {
            if (pkceMethod !== "S256") {
                throw new TypeError(`Invalid value for 'pkceMethod', expected 'S256' but got '${pkceMethod}'.`);
            }

            // hash codeVerifier, then encode as url-safe base64 without padding
            const hashBytes = new Uint8Array(sha256.arrayBuffer(codeVerifier));
            const encodedHash = bytesToBase64(hashBytes)
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/\=/g, '');

            return encodedHash;
        }

        function buildClaimsParameter(requestedAcr){
            var claims = {
                id_token: {
                    acr: requestedAcr
                }
            };
            return JSON.stringify(claims);
        }

        kc.createLoginUrl = function(options) {
            var state = createUUID();
            var nonce = createUUID();

            var redirectUri = adapter.redirectUri(options);

            var callbackState = {
                state: state,
                nonce: nonce,
                redirectUri: encodeURIComponent(redirectUri)
            };

            if (options && options.prompt) {
                callbackState.prompt = options.prompt;
            }

            var baseUrl;
            if (options && options.action == 'register') {
                baseUrl = kc.endpoints.register();
            } else {
                baseUrl = kc.endpoints.authorize();
            }

            var scope = options && options.scope || kc.scope;
            if (!scope) {
                // if scope is not set, default to "openid"
                scope = "openid";
            } else if (scope.indexOf("openid") === -1) {
                // if openid scope is missing, prefix the given scopes with it
                scope = "openid " + scope;
            }

            var url = baseUrl
                + '?client_id=' + encodeURIComponent(kc.clientId)
                + '&redirect_uri=' + encodeURIComponent(redirectUri)
                + '&state=' + encodeURIComponent(state)
                + '&response_mode=' + encodeURIComponent(kc.responseMode)
                + '&response_type=' + encodeURIComponent(kc.responseType)
                + '&scope=' + encodeURIComponent(scope);
            if (useNonce) {
                url = url + '&nonce=' + encodeURIComponent(nonce);
            }

            if (options && options.prompt) {
                url += '&prompt=' + encodeURIComponent(options.prompt);
            }

            if (options && options.maxAge) {
                url += '&max_age=' + encodeURIComponent(options.maxAge);
            }

            if (options && options.loginHint) {
                url += '&login_hint=' + encodeURIComponent(options.loginHint);
            }

            if (options && options.idpHint) {
                url += '&kc_idp_hint=' + encodeURIComponent(options.idpHint);
            }

            if (options && options.action && options.action != 'register') {
                url += '&kc_action=' + encodeURIComponent(options.action);
            }

            if (options && options.locale) {
                url += '&ui_locales=' + encodeURIComponent(options.locale);
            }

            if (options && options.acr) {
                var claimsParameter = buildClaimsParameter(options.acr);
                url += '&claims=' + encodeURIComponent(claimsParameter);
            }

            if ((options && options.acrValues) || kc.acrValues) {
                url += '&acr_values=' + encodeURIComponent(options.acrValues || kc.acrValues);
            }

            if (kc.pkceMethod) {
                var codeVerifier = generateCodeVerifier(96);
                callbackState.pkceCodeVerifier = codeVerifier;
                var pkceChallenge = generatePkceChallenge(kc.pkceMethod, codeVerifier);
                url += '&code_challenge=' + pkceChallenge;
                url += '&code_challenge_method=' + kc.pkceMethod;
            }

            callbackStorage.add(callbackState);

            return url;
        };

        kc.logout = function(options) {
            return adapter.logout(options);
        };

        kc.createLogoutUrl = function(options) {

            const logoutMethod = options?.logoutMethod ?? kc.logoutMethod;
            if (logoutMethod === 'POST') {
                return kc.endpoints.logout();
            }

            var url = kc.endpoints.logout()
                + '?client_id=' + encodeURIComponent(kc.clientId)
                + '&post_logout_redirect_uri=' + encodeURIComponent(adapter.redirectUri(options, false));

            if (kc.idToken) {
                url += '&id_token_hint=' + encodeURIComponent(kc.idToken);
            }

            return url;
        };

        kc.register = function (options) {
            return adapter.register(options);
        };

        kc.createRegisterUrl = function(options) {
            if (!options) {
                options = {};
            }
            options.action = 'register';
            return kc.createLoginUrl(options);
        };

        kc.createAccountUrl = function(options) {
            var realm = getRealmUrl();
            var url = undefined;
            if (typeof realm !== 'undefined') {
                url = realm
                + '/account'
                + '?referrer=' + encodeURIComponent(kc.clientId)
                + '&referrer_uri=' + encodeURIComponent(adapter.redirectUri(options));
            }
            return url;
        };

        kc.accountManagement = function() {
            return adapter.accountManagement();
        };

        kc.hasRealmRole = function (role) {
            var access = kc.realmAccess;
            return !!access && access.roles.indexOf(role) >= 0;
        };

        kc.hasResourceRole = function(role, resource) {
            if (!kc.resourceAccess) {
                return false;
            }

            var access = kc.resourceAccess[resource || kc.clientId];
            return !!access && access.roles.indexOf(role) >= 0;
        };

        kc.loadUserProfile = function() {
            var url = getRealmUrl() + '/account';
            var req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.setRequestHeader('Accept', 'application/json');
            req.setRequestHeader('Authorization', 'bearer ' + kc.token);

            var promise = createPromise();

            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        kc.profile = JSON.parse(req.responseText);
                        promise.setSuccess(kc.profile);
                    } else {
                        promise.setError();
                    }
                }
            };

            req.send();

            return promise.promise;
        };

        kc.loadUserInfo = function() {
            var url = kc.endpoints.userinfo();
            var req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.setRequestHeader('Accept', 'application/json');
            req.setRequestHeader('Authorization', 'bearer ' + kc.token);

            var promise = createPromise();

            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        kc.userInfo = JSON.parse(req.responseText);
                        promise.setSuccess(kc.userInfo);
                    } else {
                        promise.setError();
                    }
                }
            };

            req.send();

            return promise.promise;
        };

        kc.isTokenExpired = function(minValidity) {
            if (!kc.tokenParsed || (!kc.refreshToken && kc.flow != 'implicit' )) {
                throw 'Not authenticated';
            }

            if (kc.timeSkew == null) {
                logInfo('[KEYCLOAK] Unable to determine if token is expired as timeskew is not set');
                return true;
            }

            var expiresIn = kc.tokenParsed['exp'] - Math.ceil(new Date().getTime() / 1000) + kc.timeSkew;
            if (minValidity) {
                if (isNaN(minValidity)) {
                    throw 'Invalid minValidity';
                }
                expiresIn -= minValidity;
            }
            return expiresIn < 0;
        };

        kc.updateToken = function(minValidity) {
            var promise = createPromise();

            if (!kc.refreshToken) {
                promise.setError();
                return promise.promise;
            }

            minValidity = minValidity || 5;

            var exec = function() {
                var refreshToken = false;
                if (minValidity == -1) {
                    refreshToken = true;
                    logInfo('[KEYCLOAK] Refreshing token: forced refresh');
                } else if (!kc.tokenParsed || kc.isTokenExpired(minValidity)) {
                    refreshToken = true;
                    logInfo('[KEYCLOAK] Refreshing token: token expired');
                }

                if (!refreshToken) {
                    promise.setSuccess(false);
                } else {
                    var params = 'grant_type=refresh_token&' + 'refresh_token=' + kc.refreshToken;
                    var url = kc.endpoints.token();

                    refreshQueue.push(promise);

                    if (refreshQueue.length == 1) {
                        var req = new XMLHttpRequest();
                        req.open('POST', url, true);
                        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        req.withCredentials = true;

                        params += '&client_id=' + encodeURIComponent(kc.clientId);

                        var timeLocal = new Date().getTime();

                        req.onreadystatechange = function () {
                            if (req.readyState == 4) {
                                if (req.status == 200) {
                                    logInfo('[KEYCLOAK] Token refreshed');

                                    timeLocal = (timeLocal + new Date().getTime()) / 2;

                                    var tokenResponse = JSON.parse(req.responseText);

                                    setToken(tokenResponse['access_token'], tokenResponse['refresh_token'], tokenResponse['id_token'], timeLocal);

                                    kc.onAuthRefreshSuccess && kc.onAuthRefreshSuccess();
                                    for (var p = refreshQueue.pop(); p != null; p = refreshQueue.pop()) {
                                        p.setSuccess(true);
                                    }
                                } else {
                                    logWarn('[KEYCLOAK] Failed to refresh token');

                                    if (req.status == 400) {
                                        kc.clearToken();
                                    }

                                    kc.onAuthRefreshError && kc.onAuthRefreshError();
                                    for (var p = refreshQueue.pop(); p != null; p = refreshQueue.pop()) {
                                        p.setError(true);
                                    }
                                }
                            }
                        };

                        req.send(params);
                    }
                }
            };

            if (loginIframe.enable) {
                var iframePromise = checkLoginIframe();
                iframePromise.then(function() {
                    exec();
                }).catch(function(error) {
                    promise.setError(error);
                });
            } else {
                exec();
            }

            return promise.promise;
        };

        kc.clearToken = function() {
            if (kc.token) {
                setToken(null, null, null);
                kc.onAuthLogout && kc.onAuthLogout();
                if (kc.loginRequired) {
                    kc.login();
                }
            }
        };

        function getRealmUrl() {
            if (typeof kc.authServerUrl !== 'undefined') {
                if (kc.authServerUrl.charAt(kc.authServerUrl.length - 1) == '/') {
                    return kc.authServerUrl + 'realms/' + encodeURIComponent(kc.realm);
                } else {
                    return kc.authServerUrl + '/realms/' + encodeURIComponent(kc.realm);
                }
            } else {
                return undefined;
            }
        }

        function getOrigin() {
            if (!window.location.origin) {
                return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
            } else {
                return window.location.origin;
            }
        }

        function processCallback(oauth, promise) {
            var code = oauth.code;
            var error = oauth.error;
            var prompt = oauth.prompt;

            var timeLocal = new Date().getTime();

            if (oauth['kc_action_status']) {
                kc.onActionUpdate && kc.onActionUpdate(oauth['kc_action_status']);
            }

            if (error) {
                if (prompt != 'none') {
                    var errorData = { error: error, error_description: oauth.error_description };
                    kc.onAuthError && kc.onAuthError(errorData);
                    promise && promise.setError(errorData);
                } else {
                    promise && promise.setSuccess();
                }
                return;
            } else if ((kc.flow != 'standard') && (oauth.access_token || oauth.id_token)) {
                authSuccess(oauth.access_token, null, oauth.id_token, true);
            }

            if ((kc.flow != 'implicit') && code) {
                var params = 'code=' + code + '&grant_type=authorization_code';
                var url = kc.endpoints.token();

                var req = new XMLHttpRequest();
                req.open('POST', url, true);
                req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                params += '&client_id=' + encodeURIComponent(kc.clientId);
                params += '&redirect_uri=' + oauth.redirectUri;

                if (oauth.pkceCodeVerifier) {
                    params += '&code_verifier=' + oauth.pkceCodeVerifier;
                }

                req.withCredentials = true;

                req.onreadystatechange = function() {
                    if (req.readyState == 4) {
                        if (req.status == 200) {

                            var tokenResponse = JSON.parse(req.responseText);
                            authSuccess(tokenResponse['access_token'], tokenResponse['refresh_token'], tokenResponse['id_token'], kc.flow === 'standard');
                            scheduleCheckIframe();
                        } else {
                            kc.onAuthError && kc.onAuthError();
                            promise && promise.setError();
                        }
                    }
                };

                req.send(params);
            }

            function authSuccess(accessToken, refreshToken, idToken, fulfillPromise) {
                timeLocal = (timeLocal + new Date().getTime()) / 2;

                setToken(accessToken, refreshToken, idToken, timeLocal);

                if (useNonce && (kc.idTokenParsed && kc.idTokenParsed.nonce != oauth.storedNonce)) {
                    logInfo('[KEYCLOAK] Invalid nonce, clearing token');
                    kc.clearToken();
                    promise && promise.setError();
                } else {
                    if (fulfillPromise) {
                        kc.onAuthSuccess && kc.onAuthSuccess();
                        promise && promise.setSuccess();
                    }
                }
            }

        }

        function loadConfig(url) {
            var promise = createPromise();
            var configUrl;

            if (!config) {
                configUrl = 'keycloak.json';
            } else if (typeof config === 'string') {
                configUrl = config;
            }

            function setupOidcEndoints(oidcConfiguration) {
                if (! oidcConfiguration) {
                    kc.endpoints = {
                        authorize: function() {
                            return getRealmUrl() + '/protocol/openid-connect/auth';
                        },
                        token: function() {
                            return getRealmUrl() + '/protocol/openid-connect/token';
                        },
                        logout: function() {
                            return getRealmUrl() + '/protocol/openid-connect/logout';
                        },
                        checkSessionIframe: function() {
                            var src = getRealmUrl() + '/protocol/openid-connect/login-status-iframe.html';
                            if (kc.iframeVersion) {
                                src = src + '?version=' + kc.iframeVersion;
                            }
                            return src;
                        },
                        thirdPartyCookiesIframe: function() {
                            var src = getRealmUrl() + '/protocol/openid-connect/3p-cookies/step1.html';
                            if (kc.iframeVersion) {
                                src = src + '?version=' + kc.iframeVersion;
                            }
                            return src;
                        },
                        register: function() {
                            return getRealmUrl() + '/protocol/openid-connect/registrations';
                        },
                        userinfo: function() {
                            return getRealmUrl() + '/protocol/openid-connect/userinfo';
                        }
                    };
                } else {
                    kc.endpoints = {
                        authorize: function() {
                            return oidcConfiguration.authorization_endpoint;
                        },
                        token: function() {
                            return oidcConfiguration.token_endpoint;
                        },
                        logout: function() {
                            if (!oidcConfiguration.end_session_endpoint) {
                                throw "Not supported by the OIDC server";
                            }
                            return oidcConfiguration.end_session_endpoint;
                        },
                        checkSessionIframe: function() {
                            if (!oidcConfiguration.check_session_iframe) {
                                throw "Not supported by the OIDC server";
                            }
                            return oidcConfiguration.check_session_iframe;
                        },
                        register: function() {
                            throw 'Redirection to "Register user" page not supported in standard OIDC mode';
                        },
                        userinfo: function() {
                            if (!oidcConfiguration.userinfo_endpoint) {
                                throw "Not supported by the OIDC server";
                            }
                            return oidcConfiguration.userinfo_endpoint;
                        }
                    };
                }
            }

            if (configUrl) {
                var req = new XMLHttpRequest();
                req.open('GET', configUrl, true);
                req.setRequestHeader('Accept', 'application/json');

                req.onreadystatechange = function () {
                    if (req.readyState == 4) {
                        if (req.status == 200 || fileLoaded(req)) {
                            var config = JSON.parse(req.responseText);

                            kc.authServerUrl = config['auth-server-url'];
                            kc.realm = config['realm'];
                            kc.clientId = config['resource'];
                            setupOidcEndoints(null);
                            promise.setSuccess();
                        } else {
                            promise.setError();
                        }
                    }
                };

                req.send();
            } else {
                if (!config.clientId) {
                    throw 'clientId missing';
                }

                kc.clientId = config.clientId;

                var oidcProvider = config['oidcProvider'];
                if (!oidcProvider) {
                    if (!config['url']) {
                        var scripts = document.getElementsByTagName('script');
                        for (var i = 0; i < scripts.length; i++) {
                            if (scripts[i].src.match(/.*keycloak\.js/)) {
                                config.url = scripts[i].src.substr(0, scripts[i].src.indexOf('/js/keycloak.js'));
                                break;
                            }
                        }
                    }
                    if (!config.realm) {
                        throw 'realm missing';
                    }

                    kc.authServerUrl = config.url;
                    kc.realm = config.realm;
                    setupOidcEndoints(null);
                    promise.setSuccess();
                } else {
                    if (typeof oidcProvider === 'string') {
                        var oidcProviderConfigUrl;
                        if (oidcProvider.charAt(oidcProvider.length - 1) == '/') {
                            oidcProviderConfigUrl = oidcProvider + '.well-known/openid-configuration';
                        } else {
                            oidcProviderConfigUrl = oidcProvider + '/.well-known/openid-configuration';
                        }
                        var req = new XMLHttpRequest();
                        req.open('GET', oidcProviderConfigUrl, true);
                        req.setRequestHeader('Accept', 'application/json');

                        req.onreadystatechange = function () {
                            if (req.readyState == 4) {
                                if (req.status == 200 || fileLoaded(req)) {
                                    var oidcProviderConfig = JSON.parse(req.responseText);
                                    setupOidcEndoints(oidcProviderConfig);
                                    promise.setSuccess();
                                } else {
                                    promise.setError();
                                }
                            }
                        };

                        req.send();
                    } else {
                        setupOidcEndoints(oidcProvider);
                        promise.setSuccess();
                    }
                }
            }

            return promise.promise;
        }

        function fileLoaded(xhr) {
            return xhr.status == 0 && xhr.responseText && xhr.responseURL.startsWith('file:');
        }

        function setToken(token, refreshToken, idToken, timeLocal) {
            if (kc.tokenTimeoutHandle) {
                clearTimeout(kc.tokenTimeoutHandle);
                kc.tokenTimeoutHandle = null;
            }

            if (refreshToken) {
                kc.refreshToken = refreshToken;
                kc.refreshTokenParsed = jwtDecode(refreshToken);
            } else {
                delete kc.refreshToken;
                delete kc.refreshTokenParsed;
            }

            if (idToken) {
                kc.idToken = idToken;
                kc.idTokenParsed = jwtDecode(idToken);
            } else {
                delete kc.idToken;
                delete kc.idTokenParsed;
            }

            if (token) {
                kc.token = token;
                kc.tokenParsed = jwtDecode(token);
                kc.sessionId = kc.tokenParsed.session_state;
                kc.authenticated = true;
                kc.subject = kc.tokenParsed.sub;
                kc.realmAccess = kc.tokenParsed.realm_access;
                kc.resourceAccess = kc.tokenParsed.resource_access;

                if (timeLocal) {
                    kc.timeSkew = Math.floor(timeLocal / 1000) - kc.tokenParsed.iat;
                }

                if (kc.timeSkew != null) {
                    logInfo('[KEYCLOAK] Estimated time difference between browser and server is ' + kc.timeSkew + ' seconds');

                    if (kc.onTokenExpired) {
                        var expiresIn = (kc.tokenParsed['exp'] - (new Date().getTime() / 1000) + kc.timeSkew) * 1000;
                        logInfo('[KEYCLOAK] Token expires in ' + Math.round(expiresIn / 1000) + ' s');
                        if (expiresIn <= 0) {
                            kc.onTokenExpired();
                        } else {
                            kc.tokenTimeoutHandle = setTimeout(kc.onTokenExpired, expiresIn);
                        }
                    }
                }
            } else {
                delete kc.token;
                delete kc.tokenParsed;
                delete kc.subject;
                delete kc.realmAccess;
                delete kc.resourceAccess;

                kc.authenticated = false;
            }
        }

        function createUUID() {
            var hexDigits = '0123456789abcdef';
            var s = generateRandomString(36, hexDigits).split("");
            s[14] = '4';
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
            s[8] = s[13] = s[18] = s[23] = '-';
            var uuid = s.join('');
            return uuid;
        }

        function parseCallback(url) {
            var oauth = parseCallbackUrl(url);
            if (!oauth) {
                return;
            }

            var oauthState = callbackStorage.get(oauth.state);

            if (oauthState) {
                oauth.valid = true;
                oauth.redirectUri = oauthState.redirectUri;
                oauth.storedNonce = oauthState.nonce;
                oauth.prompt = oauthState.prompt;
                oauth.pkceCodeVerifier = oauthState.pkceCodeVerifier;
            }

            return oauth;
        }

        function parseCallbackUrl(url) {
            var supportedParams;
            switch (kc.flow) {
                case 'standard':
                    supportedParams = ['code', 'state', 'session_state', 'kc_action_status', 'iss'];
                    break;
                case 'implicit':
                    supportedParams = ['access_token', 'token_type', 'id_token', 'state', 'session_state', 'expires_in', 'kc_action_status', 'iss'];
                    break;
                case 'hybrid':
                    supportedParams = ['access_token', 'token_type', 'id_token', 'code', 'state', 'session_state', 'expires_in', 'kc_action_status', 'iss'];
                    break;
            }

            supportedParams.push('error');
            supportedParams.push('error_description');
            supportedParams.push('error_uri');

            var queryIndex = url.indexOf('?');
            var fragmentIndex = url.indexOf('#');

            var newUrl;
            var parsed;

            if (kc.responseMode === 'query' && queryIndex !== -1) {
                newUrl = url.substring(0, queryIndex);
                parsed = parseCallbackParams(url.substring(queryIndex + 1, fragmentIndex !== -1 ? fragmentIndex : url.length), supportedParams);
                if (parsed.paramsString !== '') {
                    newUrl += '?' + parsed.paramsString;
                }
                if (fragmentIndex !== -1) {
                    newUrl += url.substring(fragmentIndex);
                }
            } else if (kc.responseMode === 'fragment' && fragmentIndex !== -1) {
                newUrl = url.substring(0, fragmentIndex);
                parsed = parseCallbackParams(url.substring(fragmentIndex + 1), supportedParams);
                if (parsed.paramsString !== '') {
                    newUrl += '#' + parsed.paramsString;
                }
            }

            if (parsed && parsed.oauthParams) {
                if (kc.flow === 'standard' || kc.flow === 'hybrid') {
                    if ((parsed.oauthParams.code || parsed.oauthParams.error) && parsed.oauthParams.state) {
                        parsed.oauthParams.newUrl = newUrl;
                        return parsed.oauthParams;
                    }
                } else if (kc.flow === 'implicit') {
                    if ((parsed.oauthParams.access_token || parsed.oauthParams.error) && parsed.oauthParams.state) {
                        parsed.oauthParams.newUrl = newUrl;
                        return parsed.oauthParams;
                    }
                }
            }
        }

        function parseCallbackParams(paramsString, supportedParams) {
            var p = paramsString.split('&');
            var result = {
                paramsString: '',
                oauthParams: {}
            };
            for (var i = 0; i < p.length; i++) {
                var split = p[i].indexOf("=");
                var key = p[i].slice(0, split);
                if (supportedParams.indexOf(key) !== -1) {
                    result.oauthParams[key] = p[i].slice(split + 1);
                } else {
                    if (result.paramsString !== '') {
                        result.paramsString += '&';
                    }
                    result.paramsString += p[i];
                }
            }
            return result;
        }

        function createPromise() {
            // Need to create a native Promise which also preserves the
            // interface of the custom promise type previously used by the API
            var p = {
                setSuccess: function(result) {
                    p.resolve(result);
                },

                setError: function(result) {
                    p.reject(result);
                }
            };
            p.promise = new Promise(function(resolve, reject) {
                p.resolve = resolve;
                p.reject = reject;
            });

            return p;
        }

        // Function to extend existing native Promise with timeout
        function applyTimeoutToPromise(promise, timeout, errorMessage) {
            var timeoutHandle = null;
            var timeoutPromise = new Promise(function (resolve, reject) {
                timeoutHandle = setTimeout(function () {
                    reject({ "error": errorMessage || "Promise is not settled within timeout of " + timeout + "ms" });
                }, timeout);
            });

            return Promise.race([promise, timeoutPromise]).finally(function () {
                clearTimeout(timeoutHandle);
            });
        }

        function setupCheckLoginIframe() {
            var promise = createPromise();

            if (!loginIframe.enable) {
                promise.setSuccess();
                return promise.promise;
            }

            if (loginIframe.iframe) {
                promise.setSuccess();
                return promise.promise;
            }

            var iframe = document.createElement('iframe');
            loginIframe.iframe = iframe;

            iframe.onload = function() {
                var authUrl = kc.endpoints.authorize();
                if (authUrl.charAt(0) === '/') {
                    loginIframe.iframeOrigin = getOrigin();
                } else {
                    loginIframe.iframeOrigin = authUrl.substring(0, authUrl.indexOf('/', 8));
                }
                promise.setSuccess();
            };

            var src = kc.endpoints.checkSessionIframe();
            iframe.setAttribute('src', src );
            iframe.setAttribute('sandbox', 'allow-storage-access-by-user-activation allow-scripts allow-same-origin');
            iframe.setAttribute('title', 'keycloak-session-iframe' );
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            var messageCallback = function(event) {
                if ((event.origin !== loginIframe.iframeOrigin) || (loginIframe.iframe.contentWindow !== event.source)) {
                    return;
                }

                if (!(event.data == 'unchanged' || event.data == 'changed' || event.data == 'error')) {
                    return;
                }


                if (event.data != 'unchanged') {
                    kc.clearToken();
                }

                var callbacks = loginIframe.callbackList.splice(0, loginIframe.callbackList.length);

                for (var i = callbacks.length - 1; i >= 0; --i) {
                    var promise = callbacks[i];
                    if (event.data == 'error') {
                        promise.setError();
                    } else {
                        promise.setSuccess(event.data == 'unchanged');
                    }
                }
            };

            window.addEventListener('message', messageCallback, false);

            return promise.promise;
        }

        function scheduleCheckIframe() {
            if (loginIframe.enable) {
                if (kc.token) {
                    setTimeout(function() {
                        checkLoginIframe().then(function(unchanged) {
                            if (unchanged) {
                                scheduleCheckIframe();
                            }
                        });
                    }, loginIframe.interval * 1000);
                }
            }
        }

        function checkLoginIframe() {
            var promise = createPromise();

            if (loginIframe.iframe && loginIframe.iframeOrigin ) {
                var msg = kc.clientId + ' ' + (kc.sessionId ? kc.sessionId : '');
                loginIframe.callbackList.push(promise);
                var origin = loginIframe.iframeOrigin;
                if (loginIframe.callbackList.length == 1) {
                    loginIframe.iframe.contentWindow.postMessage(msg, origin);
                }
            } else {
                promise.setSuccess();
            }

            return promise.promise;
        }

        function check3pCookiesSupported() {
            var promise = createPromise();

            if (loginIframe.enable || kc.silentCheckSsoRedirectUri) {
                var iframe = document.createElement('iframe');
                iframe.setAttribute('src', kc.endpoints.thirdPartyCookiesIframe());
                iframe.setAttribute('sandbox', 'allow-storage-access-by-user-activation allow-scripts allow-same-origin');
                iframe.setAttribute('title', 'keycloak-3p-check-iframe' );
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                var messageCallback = function(event) {
                    if (iframe.contentWindow !== event.source) {
                        return;
                    }

                    if (event.data !== "supported" && event.data !== "unsupported") {
                        return;
                    } else if (event.data === "unsupported") {
                        logWarn(
                            "[KEYCLOAK] Your browser is blocking access to 3rd-party cookies, this means:\n\n" +
                            " - It is not possible to retrieve tokens without redirecting to the Keycloak server (a.k.a. no support for silent authentication).\n" +
                            " - It is not possible to automatically detect changes to the session status (such as the user logging out in another tab).\n\n" +
                            "For more information see: https://www.keycloak.org/docs/latest/securing_apps/#_modern_browsers"
                        );

                        loginIframe.enable = false;
                        if (kc.silentCheckSsoFallback) {
                            kc.silentCheckSsoRedirectUri = false;
                        }
                    }

                    document.body.removeChild(iframe);
                    window.removeEventListener("message", messageCallback);
                    promise.setSuccess();
                };

                window.addEventListener('message', messageCallback, false);
            } else {
                promise.setSuccess();
            }

            return applyTimeoutToPromise(promise.promise, kc.messageReceiveTimeout, "Timeout when waiting for 3rd party check iframe message.");
        }

        function loadAdapter(type) {
            if (!type || type == 'default') {
                return {
                    login: function(options) {
                        window.location.assign(kc.createLoginUrl(options));
                        return createPromise().promise;
                    },

                    logout: async function(options) {

                        const logoutMethod = options?.logoutMethod ?? kc.logoutMethod;
                        if (logoutMethod === "GET") {
                            window.location.replace(kc.createLogoutUrl(options));
                            return;
                        }

                        const logoutUrl = kc.createLogoutUrl(options);
                        const response = await fetch(logoutUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: new URLSearchParams({
                                id_token_hint: kc.idToken,
                                client_id: kc.clientId,
                                post_logout_redirect_uri: adapter.redirectUri(options, false)
                            })
                        });

                        if (response.redirected) {
                            window.location.href = response.url;
                            return;
                        }

                        if (response.ok) {
                            window.location.reload();
                            return;
                        }

                        throw new Error("Logout failed, request returned an error code.");
                    },

                    register: function(options) {
                        window.location.assign(kc.createRegisterUrl(options));
                        return createPromise().promise;
                    },

                    accountManagement : function() {
                        var accountUrl = kc.createAccountUrl();
                        if (typeof accountUrl !== 'undefined') {
                            window.location.href = accountUrl;
                        } else {
                            throw "Not supported by the OIDC server";
                        }
                        return createPromise().promise;
                    },

                    redirectUri: function(options, encodeHash) {

                        if (options && options.redirectUri) {
                            return options.redirectUri;
                        } else if (kc.redirectUri) {
                            return kc.redirectUri;
                        } else {
                            return location.href;
                        }
                    }
                };
            }

            if (type == 'cordova') {
                loginIframe.enable = false;
                var cordovaOpenWindowWrapper = function(loginUrl, target, options) {
                    if (window.cordova && window.cordova.InAppBrowser) {
                        // Use inappbrowser for IOS and Android if available
                        return window.cordova.InAppBrowser.open(loginUrl, target, options);
                    } else {
                        return window.open(loginUrl, target, options);
                    }
                };

                var shallowCloneCordovaOptions = function (userOptions) {
                    if (userOptions && userOptions.cordovaOptions) {
                        return Object.keys(userOptions.cordovaOptions).reduce(function (options, optionName) {
                            options[optionName] = userOptions.cordovaOptions[optionName];
                            return options;
                        }, {});
                    } else {
                        return {};
                    }
                };

                var formatCordovaOptions = function (cordovaOptions) {
                    return Object.keys(cordovaOptions).reduce(function (options, optionName) {
                        options.push(optionName+"="+cordovaOptions[optionName]);
                        return options;
                    }, []).join(",");
                };

                var createCordovaOptions = function (userOptions) {
                    var cordovaOptions = shallowCloneCordovaOptions(userOptions);
                    cordovaOptions.location = 'no';
                    if (userOptions && userOptions.prompt == 'none') {
                        cordovaOptions.hidden = 'yes';
                    }
                    return formatCordovaOptions(cordovaOptions);
                };

                var getCordovaRedirectUri = function() {
                    return kc.redirectUri || 'http://localhost';
                };
                
                return {
                    login: function(options) {
                        var promise = createPromise();

                        var cordovaOptions = createCordovaOptions(options);
                        var loginUrl = kc.createLoginUrl(options);
                        var ref = cordovaOpenWindowWrapper(loginUrl, '_blank', cordovaOptions);
                        var completed = false;

                        var closed = false;
                        var closeBrowser = function() {
                            closed = true;
                            ref.close();
                        };

                        ref.addEventListener('loadstart', function(event) {
                            if (event.url.indexOf(getCordovaRedirectUri()) == 0) {
                                var callback = parseCallback(event.url);
                                processCallback(callback, promise);
                                closeBrowser();
                                completed = true;
                            }
                        });

                        ref.addEventListener('loaderror', function(event) {
                            if (!completed) {
                                if (event.url.indexOf(getCordovaRedirectUri()) == 0) {
                                    var callback = parseCallback(event.url);
                                    processCallback(callback, promise);
                                    closeBrowser();
                                    completed = true;
                                } else {
                                    promise.setError();
                                    closeBrowser();
                                }
                            }
                        });

                        ref.addEventListener('exit', function(event) {
                            if (!closed) {
                                promise.setError({
                                    reason: "closed_by_user"
                                });
                            }
                        });

                        return promise.promise;
                    },

                    logout: function(options) {
                        var promise = createPromise();

                        var logoutUrl = kc.createLogoutUrl(options);
                        var ref = cordovaOpenWindowWrapper(logoutUrl, '_blank', 'location=no,hidden=yes,clearcache=yes');

                        var error;

                        ref.addEventListener('loadstart', function(event) {
                            if (event.url.indexOf(getCordovaRedirectUri()) == 0) {
                                ref.close();
                            }
                        });

                        ref.addEventListener('loaderror', function(event) {
                            if (event.url.indexOf(getCordovaRedirectUri()) == 0) {
                                ref.close();
                            } else {
                                error = true;
                                ref.close();
                            }
                        });

                        ref.addEventListener('exit', function(event) {
                            if (error) {
                                promise.setError();
                            } else {
                                kc.clearToken();
                                promise.setSuccess();
                            }
                        });

                        return promise.promise;
                    },

                    register : function(options) {
                        var promise = createPromise();
                        var registerUrl = kc.createRegisterUrl();
                        var cordovaOptions = createCordovaOptions(options);
                        var ref = cordovaOpenWindowWrapper(registerUrl, '_blank', cordovaOptions);
                        ref.addEventListener('loadstart', function(event) {
                            if (event.url.indexOf(getCordovaRedirectUri()) == 0) {
                                ref.close();
                                var oauth = parseCallback(event.url);
                                processCallback(oauth, promise);
                            }
                        });
                        return promise.promise;
                    },

                    accountManagement : function() {
                        var accountUrl = kc.createAccountUrl();
                        if (typeof accountUrl !== 'undefined') {
                            var ref = cordovaOpenWindowWrapper(accountUrl, '_blank', 'location=no');
                            ref.addEventListener('loadstart', function(event) {
                                if (event.url.indexOf(getCordovaRedirectUri()) == 0) {
                                    ref.close();
                                }
                            });
                        } else {
                            throw "Not supported by the OIDC server";
                        }
                    },

                    redirectUri: function(options) {
                        return getCordovaRedirectUri();
                    }
                }
            }

            if (type == 'cordova-native') {
                loginIframe.enable = false;

                return {
                    login: function(options) {
                        var promise = createPromise();
                        var loginUrl = kc.createLoginUrl(options);

                        universalLinks.subscribe('keycloak', function(event) {
                            universalLinks.unsubscribe('keycloak');
                            window.cordova.plugins.browsertab.close();
                            var oauth = parseCallback(event.url);
                            processCallback(oauth, promise);
                        });

                        window.cordova.plugins.browsertab.openUrl(loginUrl);
                        return promise.promise;
                    },

                    logout: function(options) {
                        var promise = createPromise();
                        var logoutUrl = kc.createLogoutUrl(options);

                        universalLinks.subscribe('keycloak', function(event) {
                            universalLinks.unsubscribe('keycloak');
                            window.cordova.plugins.browsertab.close();
                            kc.clearToken();
                            promise.setSuccess();
                        });

                        window.cordova.plugins.browsertab.openUrl(logoutUrl);
                        return promise.promise;
                    },

                    register : function(options) {
                        var promise = createPromise();
                        var registerUrl = kc.createRegisterUrl(options);
                        universalLinks.subscribe('keycloak' , function(event) {
                            universalLinks.unsubscribe('keycloak');
                            window.cordova.plugins.browsertab.close();
                            var oauth = parseCallback(event.url);
                            processCallback(oauth, promise);
                        });
                        window.cordova.plugins.browsertab.openUrl(registerUrl);
                        return promise.promise;

                    },

                    accountManagement : function() {
                        var accountUrl = kc.createAccountUrl();
                        if (typeof accountUrl !== 'undefined') {
                            window.cordova.plugins.browsertab.openUrl(accountUrl);
                        } else {
                            throw "Not supported by the OIDC server";
                        }
                    },

                    redirectUri: function(options) {
                        if (options && options.redirectUri) {
                            return options.redirectUri;
                        } else if (kc.redirectUri) {
                            return kc.redirectUri;
                        } else {
                            return "http://localhost";
                        }
                    }
                }
            }

            throw 'invalid adapter type: ' + type;
        }

        var LocalStorage = function() {
            if (!(this instanceof LocalStorage)) {
                return new LocalStorage();
            }

            localStorage.setItem('kc-test', 'test');
            localStorage.removeItem('kc-test');

            var cs = this;

            function clearExpired() {
                var time = new Date().getTime();
                for (var i = 0; i < localStorage.length; i++)  {
                    var key = localStorage.key(i);
                    if (key && key.indexOf('kc-callback-') == 0) {
                        var value = localStorage.getItem(key);
                        if (value) {
                            try {
                                var expires = JSON.parse(value).expires;
                                if (!expires || expires < time) {
                                    localStorage.removeItem(key);
                                }
                            } catch (err) {
                                localStorage.removeItem(key);
                            }
                        }
                    }
                }
            }

            cs.get = function(state) {
                if (!state) {
                    return;
                }

                var key = 'kc-callback-' + state;
                var value = localStorage.getItem(key);
                if (value) {
                    localStorage.removeItem(key);
                    value = JSON.parse(value);
                }

                clearExpired();
                return value;
            };

            cs.add = function(state) {
                clearExpired();

                var key = 'kc-callback-' + state.state;
                state.expires = new Date().getTime() + (60 * 60 * 1000);
                localStorage.setItem(key, JSON.stringify(state));
            };
        };

        var CookieStorage = function() {
            if (!(this instanceof CookieStorage)) {
                return new CookieStorage();
            }

            var cs = this;

            cs.get = function(state) {
                if (!state) {
                    return;
                }

                var value = getCookie('kc-callback-' + state);
                setCookie('kc-callback-' + state, '', cookieExpiration(-100));
                if (value) {
                    return JSON.parse(value);
                }
            };

            cs.add = function(state) {
                setCookie('kc-callback-' + state.state, JSON.stringify(state), cookieExpiration(60));
            };

            cs.removeItem = function(key) {
                setCookie(key, '', cookieExpiration(-100));
            };

            var cookieExpiration = function (minutes) {
                var exp = new Date();
                exp.setTime(exp.getTime() + (minutes*60*1000));
                return exp;
            };

            var getCookie = function (key) {
                var name = key + '=';
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return '';
            };

            var setCookie = function (key, value, expirationDate) {
                var cookie = key + '=' + value + '; '
                    + 'expires=' + expirationDate.toUTCString() + '; ';
                document.cookie = cookie;
            };
        };

        function createCallbackStorage() {
            try {
                return new LocalStorage();
            } catch (err) {
            }

            return new CookieStorage();
        }

        function createLogger(fn) {
            return function() {
                if (kc.enableLogging) {
                    fn.apply(console, Array.prototype.slice.call(arguments));
                }
            };
        }
    }

    // See: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
    function bytesToBase64(bytes) {
        const binString = String.fromCodePoint(...bytes);
        return btoa(binString);
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div0;
    	let a0;
    	let t1;
    	let a1;
    	let t3;
    	let a2;
    	let t5;
    	let div1;
    	let t6;
    	let div3;
    	let img;
    	let img_src_value;
    	let t7;
    	let div2;
    	let a3;
    	let t9;
    	let a4;
    	let t11;
    	let div8;
    	let div5;
    	let button0;
    	let t13;
    	let div4;
    	let a5;
    	let t15;
    	let a6;
    	let t17;
    	let div6;
    	let button1;
    	let t19;
    	let div7;
    	let button2;
    	let t21;
    	let div10;
    	let div9;
    	let h2;
    	let t23;
    	let p0;
    	let t25;
    	let p1;
    	let t27;
    	let p2;
    	let t29;
    	let p3;
    	let t31;
    	let p4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "Tuzilastvo";
    			t1 = space();
    			a1 = element("a");
    			a1.textContent = "Sudstvo";
    			t3 = space();
    			a2 = element("a");
    			a2.textContent = "Pogranicna policija";
    			t5 = space();
    			div1 = element("div");
    			t6 = space();
    			div3 = element("div");
    			img = element("img");
    			t7 = space();
    			div2 = element("div");
    			a3 = element("a");
    			a3.textContent = "Република Србија";
    			t9 = space();
    			a4 = element("a");
    			a4.textContent = "Министарство унутрашњих послова";
    			t11 = space();
    			div8 = element("div");
    			div5 = element("div");
    			button0 = element("button");
    			button0.textContent = "Dokumenti";
    			t13 = space();
    			div4 = element("div");
    			a5 = element("a");
    			a5.textContent = "Izrada licnih dokumenata";
    			t15 = space();
    			a6 = element("a");
    			a6.textContent = "Uvid u nekaznjavanje";
    			t17 = space();
    			div6 = element("div");
    			button1 = element("button");
    			button1.textContent = "Podnosenje prijave";
    			t19 = space();
    			div7 = element("div");
    			button2 = element("button");
    			button2.textContent = "Prijava";
    			t21 = space();
    			div10 = element("div");
    			div9 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Надлежност";
    			t23 = space();
    			p0 = element("p");
    			p0.textContent = "У Републици Србији послове државне управе утврђене законом и прописима донетим на основу закона обављају министарства. Она примењују законе и друге прописе и опште акте Народне скупштине и Владе Србије, као и опште акте председника Републике; решавају у управним стварима; врше управни надзор над обављањем поверених послова и др.";
    			t25 = space();
    			p1 = element("p");
    			p1.textContent = "Унутрашњи послови су законом утврђени послови чијим обављањем надлежни републички органи остварују безбедност Републике и њених грађана и обезбеђују остваривање њихових Уставом и законом утврђених права.";
    			t27 = space();
    			p2 = element("p");
    			p2.textContent = "Унутрашње послове државне управе обавља Министарство унутрашњих послова.";
    			t29 = space();
    			p3 = element("p");
    			p3.textContent = "Унутрашњи послови обављају се на начин којим се сваком човеку и грађанину обезбеђује једнака заштита и остваривање његових Уставом утврђених слобода и права.";
    			t31 = space();
    			p4 = element("p");
    			p4.textContent = "У обављању унутрашњих послова могу се примењивати само мере принуде које су предвиђене законом и којима се са најмање штетних последица по грађане, као и њихове организације, предузећа, установе и друге организације, постиже извршење послова.";
    			attr_dev(a0, "class", "svelte-6dyh8q");
    			add_location(a0, file, 23, 4, 587);
    			attr_dev(a1, "class", "svelte-6dyh8q");
    			add_location(a1, file, 24, 4, 609);
    			attr_dev(a2, "class", "svelte-6dyh8q");
    			add_location(a2, file, 25, 4, 628);
    			attr_dev(div0, "class", "redirect_nav svelte-6dyh8q");
    			add_location(div0, file, 22, 0, 556);
    			attr_dev(div1, "class", "mupFlagPattern svelte-6dyh8q");
    			add_location(div1, file, 27, 0, 662);
    			if (!src_url_equal(img.src, img_src_value = "../build/src/grb-srbije.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "grb");
    			set_style(img, "margin-right", "15px");
    			add_location(img, file, 30, 4, 723);
    			attr_dev(a3, "href", "#");
    			set_style(a3, "font-weight", "300");
    			set_style(a3, "padding-top", "40px");
    			set_style(a3, "margin-top", "2px");
    			set_style(a3, "margin-bottom", "2px");
    			attr_dev(a3, "class", "svelte-6dyh8q");
    			add_location(a3, file, 32, 8, 839);
    			attr_dev(a4, "href", "#");
    			set_style(a4, "font-weight", "bold");
    			set_style(a4, "margin-top", "2px");
    			attr_dev(a4, "class", "svelte-6dyh8q");
    			add_location(a4, file, 36, 8, 974);
    			attr_dev(div2, "class", "header-link svelte-6dyh8q");
    			add_location(div2, file, 31, 4, 805);
    			attr_dev(div3, "class", "header svelte-6dyh8q");
    			add_location(div3, file, 29, 0, 698);
    			attr_dev(button0, "class", "dropbtn svelte-6dyh8q");
    			add_location(button0, file, 43, 8, 1251);
    			attr_dev(a5, "href", "#");
    			attr_dev(a5, "class", "svelte-6dyh8q");
    			add_location(a5, file, 45, 12, 1345);
    			attr_dev(a6, "href", "#");
    			attr_dev(a6, "class", "svelte-6dyh8q");
    			add_location(a6, file, 46, 12, 1398);
    			attr_dev(div4, "class", "dropdown-content svelte-6dyh8q");
    			add_location(div4, file, 44, 8, 1302);
    			attr_dev(div5, "class", "dropdown svelte-6dyh8q");
    			set_style(div5, "margin-left", "auto");
    			add_location(div5, file, 42, 4, 1193);
    			attr_dev(button1, "class", "dropbtn svelte-6dyh8q");
    			add_location(button1, file, 51, 8, 1497);
    			attr_dev(div6, "class", "dropdown svelte-6dyh8q");
    			add_location(div6, file, 50, 4, 1466);
    			attr_dev(button2, "class", "dropbtn svelte-6dyh8q");
    			add_location(button2, file, 55, 8, 1623);
    			attr_dev(div7, "class", "dropdown svelte-6dyh8q");
    			set_style(div7, "margin-left", "auto");
    			add_location(div7, file, 54, 4, 1565);
    			set_style(div8, "display", "flex");
    			set_style(div8, "justify-content", "center");
    			set_style(div8, "border", "2px solid lightgray");
    			set_style(div8, "padding", "0 20px");
    			add_location(div8, file, 41, 0, 1089);
    			set_style(h2, "color", "#c7363d");
    			add_location(h2, file, 61, 8, 1790);
    			add_location(p0, file, 62, 8, 1842);
    			add_location(p1, file, 64, 8, 2189);
    			add_location(p2, file, 66, 8, 2409);
    			add_location(p3, file, 68, 8, 2498);
    			add_location(p4, file, 70, 8, 2672);
    			set_style(div9, "width", "60%");
    			set_style(div9, "margin", "0 auto");
    			add_location(div9, file, 60, 4, 1740);
    			set_style(div10, "width", "100%");
    			add_location(div10, file, 59, 0, 1709);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, a0);
    			append_dev(div0, t1);
    			append_dev(div0, a1);
    			append_dev(div0, t3);
    			append_dev(div0, a2);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, img);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, a3);
    			append_dev(div2, t9);
    			append_dev(div2, a4);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div5);
    			append_dev(div5, button0);
    			append_dev(div5, t13);
    			append_dev(div5, div4);
    			append_dev(div4, a5);
    			append_dev(div4, t15);
    			append_dev(div4, a6);
    			append_dev(div8, t17);
    			append_dev(div8, div6);
    			append_dev(div6, button1);
    			append_dev(div8, t19);
    			append_dev(div8, div7);
    			append_dev(div7, button2);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, h2);
    			append_dev(div9, t23);
    			append_dev(div9, p0);
    			append_dev(div9, t25);
    			append_dev(div9, p1);
    			append_dev(div9, t27);
    			append_dev(div9, p2);
    			append_dev(div9, t29);
    			append_dev(div9, p3);
    			append_dev(div9, t31);
    			append_dev(div9, p4);

    			if (!mounted) {
    				dispose = listen_dev(
    					button2,
    					"click",
    					function () {
    						if (is_function(/*keycloak*/ ctx[0].login)) /*keycloak*/ ctx[0].login.apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div8);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(div10);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let keycloak;

    	onMount(_ => {
    		try {
    			$$invalidate(0, keycloak = new Keycloak({
    					url: 'http://localhost:9000/',
    					realm: 'tiseu',
    					clientId: 'mup'
    				}));

    			keycloak.init({
    				checkLoginIframe: false,
    				redirectUri: 'http://0.0.0.0:5173/'
    			});
    		} catch(error) {
    			console.log('error: ', error);
    		}

    		console.log('keycloak: ', JSON.stringify(keycloak));
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Keycloak, onMount, keycloak });

    	$$self.$inject_state = $$props => {
    		if ('keycloak' in $$props) $$invalidate(0, keycloak = $$props.keycloak);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [keycloak];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
