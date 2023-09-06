describe("Servers test (with setup and tear-down)", function() {
  beforeEach(function () {
    // initialization logic
    serverNameInput.value = 'Alice';
  });

  it('should add a new server to allServers on submitServerInfo()', function () {
    submitServerInfo();

    expect(Object.keys(allServers).length).toEqual(1);
    expect(allServers['server' + serverId].serverName).toEqual('Alice');
  });

  it("should have one server in the server table after one server entered", function(){
    submitServerInfo();
    expect(serverTbody.childElementCount).toBe(1);
  });

  it("should leave the server table empty when allServers is empty", function(){
    updateServerTable();
    expect(serverTbody.innerHTML).toBe("");
  });

  it("should remove a server from the server table", function(){
    submitServerInfo();
    serverTbody.rows[0].lastElementChild.click();
    expect(serverTbody.rows.length).toBe(0);
  });

  afterEach(function() {
    // teardown logic
    serverNameInput.value = "";
    serverTbody.innerHTML = "";
    allServers = {};
    serverId = 0;
  });
});
