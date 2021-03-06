var assert = require('assert');

var app = require('../../app');
var fs = require('fs');
var db = require('../../db/db');

var testdata = require('../testdata');
var request = require('supertest');
var expect = require('expect.js');
var async = require('async');
var CONFIG = require('config');
var error = require('../../api/error');

describe('routes.file', function () {
    var con;
    beforeEach(function (done) {
        testdata.load(['test/default-data.yaml'], function (err) {
            con = new db.Database();
            done();
        });
    });
    afterEach(function (done) {
        CONFIG.ads.uploadPath = CONFIG.getOriginalConfig().ads.uploadPath;
        CONFIG.resetRuntime(function (err, written, buffer) {
            testdata.clear(function (err) {
                return done();
            });
        });
    });
    describe('upload', function () {
        it('should return HTTP200 return URL ', function (done) {
            this.timeout(15000);
            request(app['app']).post('/file').set('cookie', 'sessionUserId=s%3A101.SQWKjEKxpbMKXLHsW9rfisXGiw4OmNiufkVaJYEOOmc').attach('upfile', 'test/routes/testfiles/uptest.txt').expect(200).end(function (err, res) {
                if (err)
                    throw err;
                assert.notStrictEqual(undefined, res.text);
                assert.notStrictEqual(null, res.text);
                assert.notEqual('', res.text);
                expect(res.text).match(/URL=file\/[0-9]+\/uptest.txt$/);
                done();
            });
        });
        it('auth required ', function (done) {
            this.timeout(15000);
            request(app['app']).post('/file').attach('upfile', 'test/routes/testfiles/uptest.txt').expect(error.HTTP_STATUS.UNAUTHORIZED).end(function (err, res) {
                if (err)
                    throw err;
                assert.notStrictEqual(undefined, res.text);
                assert.notStrictEqual(null, res.text);
                assert.notEqual('', res.text);
                expect(res.text).to.eql('You have to login before uploading files.');
                done();
            });
        });
        it('Upload files have been move or ', function (done) {
            request(app['app']).post('/file').set('cookie', 'sessionUserId=s%3A101.SQWKjEKxpbMKXLHsW9rfisXGiw4OmNiufkVaJYEOOmc').attach('upfile', 'test/routes/testfiles/uptest.txt').expect(200).end(function (err, res) {
                if (err)
                    throw err;

                var d = new Date();
                var yy = String(d.getFullYear());
                var mm = String(d.getMonth() + 1);
                var dd = String(d.getDate());
                if (mm.length == 1)
                    mm = '0' + mm;
                if (dd.length == 1)
                    dd = '0' + dd;
                var todayDir = yy + '/' + mm + '/' + dd;
                var url = res.text.split('=')[1];
                var filename = url.replace(/.*file\/([0-9]+)\/.*/, '$1');
                assert.equal(true, fs.existsSync('upload/' + todayDir + '/' + filename));

                done();
            });
        });
        it('DB.file.path for any updates ', function (done) {
            request(app['app']).post('/file').set('cookie', 'sessionUserId=s%3A101.SQWKjEKxpbMKXLHsW9rfisXGiw4OmNiufkVaJYEOOmc').attach('upfile', 'test/routes/testfiles/uptest.txt').expect(200).end(function (err, res) {
                if (err)
                    throw err;

                var url = res.text.split('=')[1];
                var fileId = url.replace(/.*file\/([0-9]+)\/.*/, '$1');
                var con = new db.Database();
                con.query('select path from file where id = ?', [fileId], function (err, expectedResult) {
                    if (err) {
                        con.close();
                        throw err;
                    }

                    var d = new Date();
                    var yy = String(d.getFullYear());
                    var mm = String(d.getMonth() + 1);
                    var dd = String(d.getDate());
                    if (mm.length == 1)
                        mm = '0' + mm;
                    if (dd.length == 1)
                        dd = '0' + dd;
                    var todayDir = yy + '/' + mm + '/' + dd;
                    var filename = 'upload/' + todayDir + '/' + fileId;
                    assert.equal(expectedResult[0].path, filename);
                    con.close();
                    done();
                });
            });
        });
        it('Upload File Nothing', function (done) {
            request(app['app']).post('/file').set('cookie', 'sessionUserId=s%3A101.SQWKjEKxpbMKXLHsW9rfisXGiw4OmNiufkVaJYEOOmc').expect(400).expect('Upload File not exists.').end(function (err, res) {
                if (err)
                    throw err;
                done();
            });
        });
        it('Config error', function (done) {
            CONFIG.ads.uploadPath = '';
            request(app['app']).post('/file').set('cookie', 'sessionUserId=s%3A101.SQWKjEKxpbMKXLHsW9rfisXGiw4OmNiufkVaJYEOOmc').attach('upfile', 'test/routes/testfiles/uptest.txt').expect(500).expect('The Upload path is not set.').end(function (err, res) {
                if (err)
                    throw err;
                done();
            });
        });
    });
    describe('download', function () {
        it('should return name and fileBody', function (done) {
            request(app['app']).get('/file/301/test%20file1.txt').expect(200).end(function (err, res) {
                if (err)
                    throw err;
                assert.equal(res.header['content-type'], 'text/plain; charset=UTF-8');
                assert.equal(res.header['content-disposition'], 'attachment; filename="test file1.txt"');
                assert.equal(res.text, 'アップロードテスト用のファイルです\n');
                done();
            });
        });
        it('different file name', function (done) {
            request(app['app']).get('/file/301/another-file.txt').expect(404).expect('File Not Found').end(function (err, res) {
                if (err)
                    throw err;
                done();
            });
        });
        it('not exist file', function (done) {
            request(app['app']).get('/file/302/notfound').expect(404).expect('File Not Found').end(function (err, res) {
                if (err)
                    throw err;
                done();
            });
        });
        it('not exist DB data', function (done) {
            request(app['app']).get('/file/10000/notfound').expect(404).expect('File Not Found').end(function (err, res) {
                if (err)
                    throw err;
                done();
            });
        });
        it('without file name', function (done) {
            request(app['app']).get('/file/10000').expect(404).end(function (err, res) {
                if (err)
                    throw err;
                done();
            });
        });
        it('File ID is not a number', function (done) {
            request(app['app']).get('/file/aaa/filename').expect(404).expect('File Not Found').end(function (err, res) {
                if (err)
                    throw err;
                done();
            });
        });
    });
});

