function Parallel (count, callback) {
    this.count = count;
    this.callback = callback;
    this.results = {};
    return parallel.bind(this);
}

function parallel (key, value) {
    this.results[key] = value;
    this.count -= 1;
    if (this.count <= 0) {
        this.callback(this.results);
    }
};

define(function () {
    return Parallel;
});
