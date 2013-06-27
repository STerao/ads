
var db = require('../../db/db')
var monitor = require('../../api/monitor')
var error = require('../../api/error')
var expect = require('expect.js');
describe('api', function () {
    describe('monitor', function () {
        describe('modifyMonitorStatus', function () {
            it('system node ID not existing is specified ', function (done) {
                monitor.modifyMonitorStatus({
                    evidenceId: 1,
                    systemNodeId: 99999,
                    timestamp: '2013-06-26T12:30:30.999Z',
                    comment: 'Unit Test run',
                    status: 'NG'
                }, {
                    onSuccess: function (result) {
                        console.log('bbb');
                        done();
                    },
                    onFailure: function (err) {
                        expect(err).not.to.be(null);
                        expect(err instanceof error.NotFoundError).to.be(true);
                        done();
                    }
                });
            });
            it('dcaseId not existing is specified ', function (done) {
                monitor.modifyMonitorStatus({
                    evidenceId: 1,
                    systemNodeId: 1,
                    timestamp: '2013-06-26T12:30:30.999Z',
                    comment: 'Unit Test run',
                    status: 'NG'
                }, {
                    onSuccess: function (result) {
                        console.log('aaa');
                        done();
                    },
                    onFailure: function (err) {
                        expect(err).not.to.be(null);
                        expect(err instanceof error.NotFoundError).to.be(true);
                        done();
                    }
                });
            });
            it('status change OK->NG', function (done) {
                monitor.modifyMonitorStatus({
                    evidenceId: 1,
                    systemNodeId: 3,
                    timestamp: '2013-06-26T12:30:30.999Z',
                    comment: 'Unit Test run',
                    status: 'NG'
                }, {
                    onSuccess: function (result) {
                        var con = new db.Database();
                        con.query('SELECT m.dcase_id, c.id, n.this_node_id, n.node_type FROM monitor_node m, commit c, node n WHERE m.id = 3 AND  m.dcase_id = c.dcase_id AND c.latest_flag = TRUE AND c.id = n.commit_id AND node_type = "Rebuttal"', function (err, expectedResult) {
                            console.log(expectedResult);
                            console.log('------------------------');
                            expect(err).to.be(null);
                            expect(1).to.be(expectedResult.length);
                            con.close();
                            done();
                        });
                    },
                    onFailure: function (err) {
                        console.log(err);
                        expect(err).not.to.be(null);
                        done();
                    }
                });
            });
            it('status change NG->OK', function (done) {
                monitor.modifyMonitorStatus({
                    evidenceId: 1,
                    systemNodeId: 3,
                    timestamp: '2013-06-26T12:30:30.999Z',
                    comment: 'Unit Test run',
                    status: 'OK'
                }, {
                    onSuccess: function (result) {
                        var con = new db.Database();
                        con.query('SELECT m.dcase_id, c.id, n.this_node_id, n.node_type FROM monitor_node m, commit c, node n WHERE m.id = 3 AND  m.dcase_id = c.dcase_id AND c.latest_flag = TRUE AND c.id = n.commit_id AND node_type = "Rebuttal"', function (err, expectedResult) {
                            console.log(expectedResult);
                            expect(err).to.be(null);
                            expect(0).to.be(expectedResult.length);
                            con.close();
                            done();
                        });
                    },
                    onFailure: function (err) {
                        console.log(err);
                        expect(err).not.to.be(null);
                        done();
                    }
                });
            });
        });
    });
});
