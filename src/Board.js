// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    /**
     * @param {array} rowIdex
     * @return {boolean}
     */
    // ---------------copy--------------

    hasRowConflictAt: function (rowIndex) {
      let rows = this.rows();
      let sum = 0;
      for (let i = 0; i < rows.length; i++) {
        sum += rows[rowIndex][i];
      }
      if (sum > 1) {
        return true;
      }
      return false;
      // reduce to see if it equals 0 or 1
      // if it does not equal to zero or one
      // return true
      // otherwise return false
    },

    // test if any rows on this board contain conflicts
    // input: n/a
    // output: boolean - false if any row had a conflict
    hasAnyRowConflicts: function () {
      let rows = this.rows();
      for (let i = 0; i < rows.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
      // // get the rows
      // loop over the rows
      // if one row has a conflict
      // return true
      // return false
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function (colIndex) {
      // create buckets
      this.columns = [];
      let rows = this.rows();
      for (let i = 0; i < rows.length; i++) {
        this.columns.push([]);
      }

      // populate buckets
      for (let j = 0; j < rows.length; j++) {
        let currentRow = rows[j];
        for (let k = 0; k < currentRow.length; k++) {
          let currentElement = currentRow[k];
          this.columns[k].push(currentElement);
        }
      }

      // checking for conflicts
      let sum = 0;
      for (let i = 0; i < this.columns[colIndex].length; i++) {
        sum += this.columns[colIndex][i];
      }
      if (sum > 1) {
        return true;
      }
      return false;
      // let columns = this.columns;
      // // reduce to see if it equals 0 or 1
      // // if it does not equal to zero or one
      // // return true
      // // otherwise return false
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function () {
      let columns = this.rows();
      for (let l = 0; l < columns.length; l++) {
        if (this.hasColConflictAt(l)) {
          return true;
        }
      }
      return false;
      // create a columns property set to empty array literal
      // get columns
      // get rows
      // create as many columns are there are rows
      // loop over each row
      // move each element of that row to it's respective column
      // check if each column has a conflict
      // if yes, then true
      // otherwise, false
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function (majorDiagonalColumnIndexAtFirstRow) {
      // get rows
      var rows = this.rows();
      // initialize sum to zero
      var sum = 0;

      // if index is zero, evaluate the main major diagonal
      if (majorDiagonalColumnIndexAtFirstRow === 0) {
        // use to check the main diagonal
        for (var h = 0; h < rows.length; h++) {
          sum += rows[h][h];
        }
        if (sum > 1) {
          return true;
        }
      }

      // if the input is positive, move right by index count via column position
      if (majorDiagonalColumnIndexAtFirstRow > 0) {
        for (let j = 0, k = majorDiagonalColumnIndexAtFirstRow; j < rows.length - majorDiagonalColumnIndexAtFirstRow; j++, k++) {
          sum += rows[j][k];
        }
        if (sum > 1) {
          return true;
        }
      }

      // if input is negative, move downwards by index count via row position
      if (majorDiagonalColumnIndexAtFirstRow < 0) {
        var absInput = Math.abs(majorDiagonalColumnIndexAtFirstRow);
        for (let j = absInput, k = 0; k < rows.length - absInput; j++, k++) {
          sum += rows[j][k];
        }
        if (sum > 1) {
          return true;
        }
      }
      // return false
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function () {
      var rows = this.rows();
      for (let i = 0; i < rows.length; i++) {
        if (this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(0, i))) {
          return true;
        }
      }
      for (let i = 0; i < rows.length; i++) {
        if (this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(i, 0))) {
          return true;
        }
      }
      return false;

      // _getFirstRowColumnIndexForMajorDiagonalOn: function (rowIndex, colIndex) {
      //   return colIndex - rowIndex;
      // },

      // var firstPosition = this._getFirstRowColumnIndexForMajorDiagonalOn(this.rows()[0], 0);
      // if (this.hasMajorDiagonalConflictAt(firstPosition)) {
      //   return true;
      // }
      // return false;
      // get first position
      //   if this.hasMajorDiagonalConflictAt first position
      //     return true;
      //   otherwise it's false
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function (minorDiagonalColumnIndexAtFirstRow) {
      //
      // get rows
      var rows = this.rows();
      // initialize sum to zero
      var sum = 0;

      // if index is zero, evaluate the main major diagonal
      if (minorDiagonalColumnIndexAtFirstRow === rows.length - 1) {
        // use to check the main diagonal
        for (var h = rows.length - 1; h >= 0; h--) {
          sum += rows[h][h];
        }
        if (sum > 1) {
          return true;
        }
      }

      // if the input is less than the main minor diagonal, move left by index count via column position
      if (minorDiagonalColumnIndexAtFirstRow < rows.length - 1) {
        for (let j = 0, k = minorDiagonalColumnIndexAtFirstRow; k >= 0; j++, k--) {
          sum += rows[j][k];
        }
        if (sum > 1) {
          return true;
        }
      }

      // if input is greater than the main minor diagonal, move downwards by index count via row position
      if (minorDiagonalColumnIndexAtFirstRow > rows.length - 1) {
        //var absInput = Math.abs(minorDiagonalColumnIndexAtFirstRow);
        for (let j = minorDiagonalColumnIndexAtFirstRow - (rows.length - 1), k = rows.length - 1;
          j <= rows.length - 1; j++, k--) {
          sum += rows[j][k];
        }
        if (sum > 1) {
          return true;
        }
      }
      // return false
      return false; // fixme

    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function () {
      var rows = this.rows();
      for (let i = rows.length - 1; i >= 0; i--) {
        if (this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(0, i))) {
          return true;
        }
      }
      for (let i = 0; i < rows.length; i++) {
        if (this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(i, rows.length - 1))) {
          return true;
        }
      }
      return false;
    },

    /*--------------------  End of Helper Functions  ---------------------*/
  });

  let makeEmptyMatrix = function (n) {
    return _(_.range(n)).map(function () {
      return _(_.range(n)).map(function () {
        return 0;
      });
    });
  };
})();

