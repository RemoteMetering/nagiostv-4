/*jshint ignore: start*/
import Ember from 'ember';

export default Ember.Helper.helper(function([v1, operator, v2]) {

    switch (operator) {
        case '==':
            return (v1 == v2);
        case '===':
            return (v1 === v2);
        case '!==':
            return (v1 !== v2);
        case '<':
            return (v1 < v2);
        case '<=':
            return (v1 <= v2);
        case '>':
            return (v1 > v2);
        case '>=':
            return (v1 >= v2);
        case '&&':
            return (v1 && v2);
        case '||':
            return (v1 || v2);
        default:
            console.log('ERROR: if-cond - Unknown operator '+operator);
            return null;
    }
});
