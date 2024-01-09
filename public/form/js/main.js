const messageCol = db.collection('message');

function openModal() {
    $('#myModal').modal('show');
}

// Hàm đóng modal
function closeModal() {
    $('#myModal').modal('hide');
}
$(document).ready(function () {
    console.log('test ready')

    var name = $('.validate-input input[name="name"]');
    console.log($('#validate-form'))
    var message = $('.validate-input textarea[name="message"]')
    $('#validate-form').on('submit', async function (event) {
        event.preventDefault();
        console.log('submit')
        var check = true;
        if ($(name).val().trim() == '') {
            showValidate(name);
            check = false;
        }
        if ($(message).val().trim() == '') {
            showValidate(message);
            check = false;
        }
        if (check) {
            messageCol.add({
                name: name.val().trim(),
                message: message.val().trim(),
                status: false,
                show: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then((response) => {
                console.log('Added document sucess: ' + response.id);
                openModal()
            }).catch((error) => {
                console.error("Add error: ", error);
            });
        }

        // return check;
    });
    $('.validate-form .input1').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });
    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }
    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
})
