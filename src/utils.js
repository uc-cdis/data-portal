export const  readFile = (file) => {
    var reader = new FileReader();

    reader.onload = function(event) {
        Promise.resolve(event.target.result);
    };

    reader.onerror = function() {
        Promise.reject(this);
    };
    reader.readAsBinaryString(file);
    return deferred.promise();
}
