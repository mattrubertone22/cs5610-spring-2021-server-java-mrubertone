var $usernameFld, $passwordFld;
var $firstNameFld, $lastNameFld, $roleFld;
var $removeBtn, $updateBtn, $createBtn;
var $userRowTemplate;
var theTableBody;
var userService = new AdminUserServiceClient();

var m_users = [];

function renderUsers(users) {
  theTableBody.empty();
  for (var i = 0; i < m_users.length; i++) {
    var user = users[i];
    theTableBody.prepend(`
          <tr class="wbdv-template wbdv-user wbdv-hidden">
          <td class="wbdv-username">${user.username}</td>
          <td>&nbsp;</td>
          <td class="wbdv-first-name">${user.firstName}</td>
          <td class="wbdv-last-name">${user.lastName}</td>
          <td class="wbdv-role">${user.role}</td>
          <td class="wbdv-actions">
            <span class="pull-right">
              <i class="fa-2x fa fa-times wbdv-remove" id="${i}"></i>
              <i class="fa-2x fa fa-pencil wbdv-edit" id="${i}"></i>
            </span>
          </td>
        </tr>`);
  }
  jQuery(".wbdv-remove").click(deleteUser);
  jQuery(".wbdv-edit").click(selectUser);
}

var selectedUser = null;

function selectUser(event) {
  var select = jQuery(event.target);
  var theIndex = select.attr("id");
  var theId = m_users[theIndex]._id;
  selectedUser = m_users.find((user) => user._id === theId);
  $usernameFld.val(selectedUser.username);
  $passwordFld.val(selectedUser.password);
  $firstNameFld.val(selectedUser.firstName);
  $lastNameFld.val(selectedUser.lastName);
  $roleFld.val(selectedUser.role);
}

function updateUser() {
  selectedUser.username = $usernameFld.val();
  selectedUser.password = $passwordFld.val();
  selectedUser.firstName = $firstNameFld.val();
  selectedUser.lastName = $lastNameFld.val();
  selectedUser.role = $roleFld.val();
  userService.updateUser(selectedUser._id, selectedUser).then((status) => {
    var index = m_users.findIndex((user) => {
      user._id === selectedUser._id
    });
    m_users[index] = selectedUser;
    renderUsers(m_users);
  })
}

function createUser(user) {
  userService.createUser(user).then((data) => {
      m_users.push(data);
      renderUsers(m_users);
    })
}

function deleteUser(event) {
  var target = jQuery(event.currentTarget);
  var theIndex = target.attr("id");
  var theId = m_users[theIndex]._id;
  userService.deleteUser(theId).then((status) => {
      m_users.splice(theIndex, 1);
      renderUsers(m_users);
    })

}

function main() {
  $usernameFld = $("#usernameFld");
  $passwordFld = $("#passwordFld");
  $firstNameFld = $("#firstNameFld");
  $lastNameFld = $("#lastNameFld");
  $roleFld = $("#roleFld");
  $createBtn = jQuery(".wbdv-create");
  $updateBtn = jQuery(".wbdv-update");
  $updateBtn.click(updateUser);
  theTableBody = jQuery(".wbdv-table-body");
  $createBtn.click(() => {
    createUser({
      username: $usernameFld.val(),
      password: $passwordFld.val(),
      firstName: $firstNameFld.val(),
      lastName: $lastNameFld.val(),
      role: $roleFld.val(),
    });
  });
  userService.findAllUsers().then((data) => {
      m_users = data;
      renderUsers(m_users);
    })
}
jQuery(main);
