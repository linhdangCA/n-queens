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
    hasRowConflictAt: function(rowIndex) {
      // add up all the number elements in the row
      // check if the sum of the elements is greater than one
      //    if it is greater, return true;
      // otherwise return false
      var sum = 0;
      for (let i = 0; i < rowIndex.length; i++) {
        sum += rowIndex[i];
      }
      return sum > 1;
    },

    // test if any rows on this board contain conflicts
    /**
     * @param {}
     * @return {}
     */
    hasAnyRowConflicts: function() {
      var rows = this.rows();
      for (var i = 0; i < rows.length; i++) {
        if (this.hasRowConflictAt(rows[i])) {
          return true;
        }
      }
      return false;
      // get the rows using the rows method
      // loop over the rows
      //   call hasRowConflictAt for each row
      //     if it returns true
      //       return true
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    // @param {array} colIndex
    // @return {boolean}
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // add up all the number elements in the col
      // check if the sum of the elements is greater than one
      //    if it is greater, return true;
      // otherwise return false
      var sum = 0;
      for (let i = 0; i < colIndex.length; i++) {
        sum += colIndex[i];
      }
      return sum > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var rows = this.rows();
      for (var i = 0; i < rows.length; i++) {
        var currentColumn = [];
        for (var j = 0; j < rows.length; j++) {
          currentColumn.push(rows[j][i]);
        }
        if (this.hasColConflictAt(currentColumn)) {
          return true;
        }
      }
      return false;
      // get access to the matrix using the rows method
      // iterate over the columns using an outside for loop
      //   declare an empty array
      //   iterate over the rows using a nested for loop
      //     populate the array
      //   if has call to the hasColConflictAt function is true
      //     return true
      // if it reaches here, return false
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    // i = rows
    // j = columns
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      for (let i = 0; i < this.rows().length; i++) {
        var bucket = [];
        var majorColumnIndex = majorDiagonalColumnIndexAtFirstRow;
        var rows = i;

        while ((rows < this.rows().length) && (majorColumnIndex < this.rows().length)) {
          var elementAt = this.rows()[rows][majorColumnIndex];
          bucket.push(elementAt);
          rows++;
          majorColumnIndex++;
        }

        var sum = 0;
        for (let i = 0; i < bucket.length; i++) {
          sum += bucket[i];
        }
        if (sum > 1) {
          return true;
        }
      }
      return false;
      // initialize variables j to the given input and i to zero
      // loop
      //   initialize an empty array
      //   open a for loop, while i is less than row's length
      //       push the coordinate value to the array
      //       increment i and j by 1
      //     sum the values in the array
      //       if greater than 1
      //         return true
      // if not, then return false
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      for (var i = 0; i < this.rows().length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
      // loop over the first row
      // callback to each column index
      // return true
      // return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      for (let i = 0; i < this.rows().length; i++) {
        var bucket = [];
        var minorColumnIndex = minorDiagonalColumnIndexAtFirstRow;
        var rows = i;

        while ((rows < this.rows().length) && (minorColumnIndex >= 0)) {
          var elementAt = this.rows()[rows][minorColumnIndex];
          bucket.push(elementAt);
          rows++;
          minorColumnIndex--;
        }

        var sum = 0;
        for (let i = 0; i < bucket.length; i++) {
          sum += bucket[i];
        }
        if (sum > 1) {
          return true;
        }
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      for (let i = this.rows().length - 1; i >= 0; i--) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
