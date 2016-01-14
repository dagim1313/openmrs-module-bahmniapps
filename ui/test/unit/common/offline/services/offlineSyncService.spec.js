'use strict';

var $scope, offlinePatientDao, eventLogService, offlineSyncService, offlineMarkerDao;

describe('OfflineSyncService', function () {
    describe('initial sync ', function () {
        beforeEach(function () {
            module('bahmni.common.offline');
            module(function ($provide) {
                $provide.value('offlinePatientDao', {
                    createPatient: function () {
                        return {
                            then: function (callback) {
                                return callback({});
                            }
                        };
                    }
                });
                $provide.value('offlineMarkerDao', {
                    getMarker: function () {
                        return {
                            then: function (callback) {
                                return callback(undefined);
                            }
                        };
                    },
                    insertMarker: function () {
                        return {
                            then: function (callback) {
                                return callback(undefined);
                            }
                        };
                    }
                });
                $provide.value('eventLogService', {
                    getEventsFor: function () {
                        return {
                            then: function (callback) {
                                return callback({
                                    data: [{
                                        object: 'url to get patient object',
                                        category: 'patient',
                                        uuid: 'eventuuid'
                                    }]
                                });
                            }
                        };
                    },
                    getDataForUrl: function () {
                        return {
                            then: function (callback) {
                                return callback({data: {uuid: 'patientUuid'}});
                            }
                        };
                    }
                });
            });
        });

        beforeEach(inject(['offlineSyncService', 'eventLogService', 'offlineMarkerDao', 'offlinePatientDao', function (offlineSyncServiceInjected, eventLogServiceInjected, offlineMarkerDaoInjected, offlinePatientDaoInjected) {
            offlineSyncService = offlineSyncServiceInjected;
            eventLogService = eventLogServiceInjected;
            offlineMarkerDao = offlineMarkerDaoInjected;
            offlinePatientDao = offlinePatientDaoInjected;
        }]));


        it('should read events from the beginning for the catchment', function () {
            spyOn(offlineMarkerDao, 'getMarker').and.callThrough();
            //offlineMarkerDao.getMarker.and.callThrough();

            spyOn(eventLogService, 'getEventsFor').and.callThrough();
            //eventLogService.getEventsFor.and.callThrough();

            spyOn(eventLogService, 'getDataForUrl').and.callThrough();
            //eventLogService.getDataForUrl.and.callThrough();

            spyOn(offlinePatientDao, 'createPatient').and.callThrough();

            spyOn(offlineMarkerDao, 'insertMarker').and.callThrough();

            offlineSyncService.sync();

            expect(offlineMarkerDao.getMarker).toHaveBeenCalled();
            expect(offlineMarkerDao.getMarker.calls.count()).toBe(1);
            expect(eventLogService.getEventsFor).toHaveBeenCalledWith(202020, undefined);
            expect(eventLogService.getEventsFor.calls.count()).toBe(1);
            expect(eventLogService.getDataForUrl).toHaveBeenCalledWith('url to get patient object');
            expect(eventLogService.getDataForUrl.calls.count()).toBe(1);
            expect(offlinePatientDao.createPatient).toHaveBeenCalledWith({patient: {uuid: 'patientUuid'}});
            expect(offlinePatientDao.createPatient.calls.count()).toBe(1);
            expect(offlineMarkerDao.insertMarker).toHaveBeenCalledWith('eventuuid', 202020);
            expect(offlineMarkerDao.insertMarker.calls.count()).toBe(1);
        });
    });

    describe('subsequent sync ', function () {
        beforeEach(function () {
            module('bahmni.common.offline');
            module(function ($provide) {
                $provide.value('offlinePatientDao', {
                    createPatient: function () {
                        return {
                            then: function (callback) {
                                return callback({});
                            }
                        };
                    }
                });
                $provide.value('offlineMarkerDao', {
                    getMarker: function () {
                        return {
                            then: function (callback) {
                                return callback({lastReadUuid: 'lastReadUuid', catchmentNumber: 202020});
                            }
                        };
                    },
                    insertMarker: function () {
                        return {
                            then: function (callback) {
                                return callback(undefined);
                            }
                        };
                    }
                });
                $provide.value('eventLogService', {
                    getEventsFor: function () {
                        return {
                            then: function (callback) {
                                return callback({
                                    data: [{
                                        object: 'url to get patient object',
                                        category: 'patient',
                                        uuid: 'eventuuid'
                                    }]
                                });
                            }
                        };
                    },
                    getDataForUrl: function () {
                        return {
                            then: function (callback) {
                                return callback({data: {uuid: 'patientUuid'}});
                            }
                        };
                    }
                });
            });
        });

        beforeEach(inject(['offlineSyncService', 'eventLogService', 'offlineMarkerDao', 'offlinePatientDao', function (offlineSyncServiceInjected, eventLogServiceInjected, offlineMarkerDaoInjected, offlinePatientDaoInjected) {
            offlineSyncService = offlineSyncServiceInjected;
            eventLogService = eventLogServiceInjected;
            offlineMarkerDao = offlineMarkerDaoInjected;
            offlinePatientDao = offlinePatientDaoInjected;
        }]));


        it('should read events from the last read uuid for the catchment', function () {
            spyOn(offlineMarkerDao, 'getMarker').and.callThrough();
            //offlineMarkerDao.getMarker.and.callThrough();

            spyOn(eventLogService, 'getEventsFor').and.callThrough();
            //eventLogService.getEventsFor.and.callThrough();

            spyOn(eventLogService, 'getDataForUrl').and.callThrough();
            //eventLogService.getDataForUrl.and.callThrough();

            spyOn(offlinePatientDao, 'createPatient').and.callThrough();

            spyOn(offlineMarkerDao, 'insertMarker').and.callThrough();

            offlineSyncService.sync();

            expect(offlineMarkerDao.getMarker).toHaveBeenCalled();
            expect(offlineMarkerDao.getMarker.calls.count()).toBe(1);
            expect(eventLogService.getEventsFor).toHaveBeenCalledWith(202020, 'lastReadUuid');
            expect(eventLogService.getEventsFor.calls.count()).toBe(1);
            expect(eventLogService.getDataForUrl).toHaveBeenCalledWith('url to get patient object');
            expect(eventLogService.getDataForUrl.calls.count()).toBe(1);
            expect(offlinePatientDao.createPatient).toHaveBeenCalledWith({patient: {uuid: 'patientUuid'}});
            expect(offlinePatientDao.createPatient.calls.count()).toBe(1);
            expect(offlineMarkerDao.insertMarker).toHaveBeenCalledWith('eventuuid', 202020);
            expect(offlineMarkerDao.insertMarker.calls.count()).toBe(1);
        });
    })
});