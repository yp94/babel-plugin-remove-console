const _ = require('lodash')

const defaultOpt = {
  console: true,
  debugger: true,
  alert: false
}

const visitor = {
  ExpressionStatement(path, state) {
    //remove console
    if (state.opts.console === undefined) {
      state.opts.console = defaultOpt.console
    }
    if (state.opts.console && path.node.expression.callee.type === 'MemberExpression' && path.node.expression.callee.object.name === 'console') {
      path.remove()
    }
    //remove alert
    if (state.opts.alert === undefined) {
      state.opts.alert = defaultOpt.alert
    }
    if (state.opts.alert && _.get(path,'node.expression.callee.name') === 'alert') {
      path.remove()
    }

    //remove custom function invoking
    if (state.opts.debugFn && state.opts.debugFn === _.get(path,'node.expression.callee.name')) {
      path.remove()
    }
  },

  //remove debugger
  DebuggerStatement(path, state) {
    if (state.opts.debugger === undefined) {
      state.opts.debugger = defaultOpt.debugger
    }
    state.opts.debugger && path.remove()
  },

  // remove custom function
  FunctionDeclaration(path, state) {
    if (state.opts.debugFn && path.node.id.name === state.opts.debugFn) {
      path.remove()
    }
  }
}

module.exports = function () {
  return {
    visitor
  }
}