'use strict';

module.exports = {
  reporter: function(errors) {
    console.log('Found ' + errors.length + ' errors');
  }
};
