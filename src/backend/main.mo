import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor {

  type Device = {
    id: Text;
    name: Text;
    pairCode: Text;
    status: Text;
    lastSeen: Int;
  };

  type LogEntry = {
    id: Text;
    deviceId: Text;
    deviceName: Text;
    eventType: Text;
    message: Text;
    timestamp: Int;
  };

  var devices: [Device] = [];
  var logs: [LogEntry] = [];
  var logCounter: Nat = 0;

  public func addDevice(name: Text, pairCode: Text) : async Text {
    let id = pairCode;
    let exists = Array.find(devices, func(d: Device) : Bool { d.pairCode == pairCode });
    switch (exists) {
      case (?_) { return "CODE_EXISTS" };
      case null {
        let newDevice: Device = {
          id = id;
          name = name;
          pairCode = pairCode;
          status = "offline";
          lastSeen = Time.now();
        };
        devices := Array.append(devices, [newDevice]);
        let entry: LogEntry = {
          id = Nat.toText(logCounter);
          deviceId = id;
          deviceName = name;
          eventType = "paired";
          message = name # " paired successfully";
          timestamp = Time.now();
        };
        logCounter += 1;
        logs := Array.append(logs, [entry]);
        return "OK";
      };
    };
  };

  public func pairDevice(pairCode: Text) : async Text {
    let found = Array.find(devices, func(d: Device) : Bool { d.pairCode == pairCode });
    switch (found) {
      case null { return "NOT_FOUND" };
      case (?d) {
        devices := Array.map(devices, func(dev: Device) : Device {
          if (dev.id == d.id) {
            { id = dev.id; name = dev.name; pairCode = dev.pairCode; status = "online"; lastSeen = Time.now() }
          } else { dev }
        });
        let entry: LogEntry = {
          id = Nat.toText(logCounter);
          deviceId = d.id;
          deviceName = d.name;
          eventType = "connected";
          message = d.name # " came online";
          timestamp = Time.now();
        };
        logCounter += 1;
        logs := Array.append(logs, [entry]);
        return d.name;
      };
    };
  };

  public func updateDeviceStatus(deviceId: Text, status: Text) : async () {
    devices := Array.map(devices, func(d: Device) : Device {
      if (d.id == deviceId) {
        { id = d.id; name = d.name; pairCode = d.pairCode; status = status; lastSeen = Time.now() }
      } else { d }
    });
  };

  public func removeDevice(deviceId: Text) : async () {
    devices := Array.filter(devices, func(d: Device) : Bool { d.id != deviceId });
  };

  public func addLog(deviceId: Text, deviceName: Text, eventType: Text, message: Text) : async () {
    let entry: LogEntry = {
      id = Nat.toText(logCounter);
      deviceId = deviceId;
      deviceName = deviceName;
      eventType = eventType;
      message = message;
      timestamp = Time.now();
    };
    logCounter += 1;
    logs := Array.append(logs, [entry]);
  };

  public query func getDevices() : async [Device] {
    return devices;
  };

  public query func getLogs() : async [LogEntry] {
    let len = logs.size();
    if (len <= 50) { return logs };
    return Array.subArray(logs, len - 50, 50);
  };

  public query func getDeviceLogs(deviceId: Text) : async [LogEntry] {
    return Array.filter(logs, func(l: LogEntry) : Bool { l.deviceId == deviceId });
  };

};
