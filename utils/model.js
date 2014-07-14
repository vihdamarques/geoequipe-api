var paths = module.exports.paths = function(model) {
    var arr = [];
    for (var property in model.schema.paths)
        if (model.schema.paths.hasOwnProperty(property) && !property.match(/^_id|^__v/g))
            arr.push(property);
    return arr;
}

var filterAttrs = module.exports.filterAttrs = function(obj, model) {
    var attrs = paths(model);
    for (var property in obj)
        if (!~attrs.indexOf(property))
            delete obj[property];
    return obj;
}

var assignAttrs = module.exports.assignAttrs = function(obj, instance) {
    obj = filterAttrs(obj, instance.constructor);
    for (var property in instance)
        if (obj[property])
            instance[property] = obj[property];
    return obj;
}

var returnMsg = module.exports.returnMsg = function(name, message, errors) {
    return {name: name || "", message: message || "", errors: errors || {}}
}