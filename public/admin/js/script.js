let employeeRef = db.collection('message');
let deleteIDs = [];
let lastSize = 0;
// REAL TIME LISTENER
employeeRef.onSnapshot(snapshot => {
	let changes = snapshot.docChanges();
	console.log("current size: ", snapshot.size);
	changes.forEach(change => {
		if (change.type == 'added') {
			if (lastSize > 0 && lastSize < snapshot.size) {
				console.log("New Item added")
				displayEmployees();
			}
		} else if (change.type == 'modified') {
			console.log('modified');
		} else if (change.type == 'removed') {
			$('tr[data-id=' + change.doc.id + ']').remove();
			console.log('removed');
		}
	});
});

// GET TOTAL SIZE
employeeRef.onSnapshot(snapshot => {
	let size = snapshot.size;
	lastSize = size;
	console.log("Size: " + size);
	$('.count').text(size);
	if (size == 0) {
		$('#selectAll').attr('disabled', true);
	} else {
		$('#selectAll').attr('disabled', false);
	}
});


const displayEmployees = async (doc) => {
	//Clear all table before load from server
	$('#employee-table #body tr').remove();
	console.log('displayEmployees');

	let employees = employeeRef;
	// .startAfter(doc || 0).limit(10000)

	const data = await employees.get();

	data.docs.forEach(doc => {
		const wish = doc.data();
		let item =
			`<tr data-id="${doc.id}">
					<td>
							<span class="custom-checkbox">
									<input type="checkbox" id="${doc.id}" name="options[]" value="${doc.id}">
									<label for="${doc.id}"></label>
							</span>
					</td>
					<td class="wish-name">${wish.name}</td>
					<td class="wish-content">${wish.message}</td>
					<td class="wish-status">${wish.status ? '<b style="color: green;">APPROVED</b>' : '<b>NEW</b>'}</td>
					<td class="wish-count">${wish.show}</td>
					<td>
							<a href="#" id="${doc.id}" class="edit js-edit-wish"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
							</a>
							<a href="#" id="${doc.id}" class="delete js-delete-wish"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
							</a>
					</td>
			</tr>`;

		$('#employee-table #body').append(item);

		// ACTIVATE TOOLTIP
		$('[data-toggle="tooltip"]').tooltip();

		// SELECT/DESELECT CHECKBOXES
		var checkbox = $('table tbody input[type="checkbox"]');
		$("#selectAll").click(function () {
			if (this.checked) {
				checkbox.each(function () {
					console.log(this.id);
					deleteIDs.push(this.id);
					this.checked = true;
				});
			} else {
				checkbox.each(function () {
					this.checked = false;
				});
			}
		});
		checkbox.click(function () {
			if (!this.checked) {
				$("#selectAll").prop("checked", false);
			}
		});
	})

	// UPDATE LATEST DOC
	latestDoc = data.docs[data.docs.length - 1];

	// UNATTACH EVENT LISTENERS IF NO MORE DOCS
	if (data.empty) {
		$('.js-loadmore').hide();
	}
}

$(document).ready(function () {

	let latestDoc = null;

	// LOAD INITIAL DATA
	displayEmployees();

	// LOAD MORE
	$(document).on('click', '.js-loadmore', function () {
		displayEmployees(latestDoc);
	});

	// ADD WISH
	$("#add-wish-form").submit(function (event) {
		event.preventDefault();
		let name = $('#wish-name').val();
		let message = $('#wish-content').val();
		let status =  $('#wish-status').prop('checked');
		let show = 0;
		db.collection('message').add({
			name: name,
			message: message,
			status: status,
			show: show,
			createdAt : firebase.firestore.FieldValue.serverTimestamp()
			}).then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
				$("#addWishModal").modal('hide');

			// 	let newEmployee =
			// 	`<tr data-id="${docRef.id}">
			// 			<td>
			// 					<span class="custom-checkbox">
			// 							<input type="checkbox" id="${docRef.id}" name="options[]" value="${docRef.id}">
			// 							<label for="${docRef.id}"></label>
			// 					</span>
			// 			</td>
			// 			<td class="wish-name">${name}</td>
			// 			<td class="wish-content">${message}</td>
			// 			<td class="wish-status">${status ? '<b style="color: green;">APPROVED</b>' : '<b>NEW</b>'}</td>
			// 			<td class="wish-count">${show}</td>
			// 			<td>
			// 					<a href="#" id="${docRef.id}" class="edit js-edit-wish"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
			// 					</a>
			// 					<a href="#" id="${docRef.id}" class="delete js-delete-wish"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
			// 					</a>
			// 			</td>
			// 	</tr>`;

			// $('#employee-table tbody').prepend(newEmployee);
			})
			.catch(function (error) {
				console.error("Error writing document: ", error);
			});
	});

	// UPDATE WISH
	$(document).on('click', '.js-edit-wish', function (e) {
		e.preventDefault();
		let id = $(this).attr('id');
		$('#edit-wish-form').attr('edit-id', id);
		let count = 0;
		db.collection('message').doc(id).get().then(function (document) {
			if (document.exists) {
				console.log(document.data())
				$('#edit-wish-form #wish-name').val(document.data().name);
				$('#edit-wish-form #wish-content').val(document.data().message);
				$('#edit-wish-form #wish-status').prop('checked', document.data().status);
				count = document.data().count;
				$('#editWishModal').modal('show');
			} else {
				console.log("No such document!");
			}
		}).catch(function (error) {
			console.log("Error getting document:", error);
		});
	});

	$("#edit-wish-form").submit(function (event) {
		event.preventDefault();
		let id = $(this).attr('edit-id');
		let name = $('#edit-wish-form #wish-name').val();
		let message = $('#edit-wish-form #wish-content').val();
		let status = $('#edit-wish-form #wish-status').prop('checked');
		
		db.collection('message').doc(id).update({
			name: name,
			message: message,
			status: status,
			updatedAt : firebase.firestore.FieldValue.serverTimestamp()
		}).then((response) => {
			console.log('Updated succesful')
		}).catch((error) => {
			console.error(error);
		});

		$('#editWishModal').modal('hide');

		// SHOW UPDATED DATA ON BROWSER
		$('tr[data-id=' + id + '] td.wish-name').html(name);
		$('tr[data-id=' + id + '] td.wish-content').html(message);
		$('tr[data-id=' + id + '] td.wish-status').html(status ? '<b style="color: green;">APPROVED</b>' : '<b>NEW</b>');
		// $('tr[data-id=' + id + '] td.wish-count').html(count);
	});

	// DELETE WISH
	$(document).on('click', '.js-delete-wish', function (e) {
		e.preventDefault();
		let id = $(this).attr('id');
		$('#delete-wish-form').attr('delete-id', id);
		$('#deleteWishModal').modal('show');
	});

	$("#delete-wish-form").submit(function (event) {
		event.preventDefault();
		let id = $(this).attr('delete-id');
		if (id != undefined) {
			db.collection('message').doc(id).delete()
				.then(function () {
					console.log("Document successfully delete!");
					$("#deleteWishModal").modal('hide');
				})
				.catch(function (error) {
					console.error("Error deleting document: ", error);
				});
		} else {
			let checkbox = $('table tbody input:checked');
			checkbox.each(function () {
				db.collection('message').doc(this.value).delete()
					.then(function () {
						console.log("Document successfully delete!");
						displayEmployees();
					})
					.catch(function (error) {
						console.error("Error deleting document: ", error);
					});
			});
			$("#deleteWishModal").modal('hide');
		}
	});

	// SEARCH
	$("#search-name").keyup(function () {
		$('#employee-table tbody').html('');
		let nameKeyword = $("#search-name").val();
		console.log(nameKeyword);
		employeeRef.orderBy('name', 'asc').startAt(nameKeyword).endAt(nameKeyword + "\uf8ff").get()
			.then(function (documentSnapshots) {
				documentSnapshots.docs.forEach(doc => {
					renderEmployee(doc);
				});
			});
	});

	// RESET FORMS
	$("#addWishModal").on('hidden.bs.modal', function () {
		$('#add-wish-form .form-control').val('');
	});

	$("#editWishModal").on('hidden.bs.modal', function () {
		$('#edit-wish-form .form-control').val('');
	});
});

// CENTER MODAL
(function ($) {
	"use strict";

	function centerModal() {
		$(this).css('display', 'block');
		var $dialog = $(this).find(".modal-dialog"),
			offset = ($(window).height() - $dialog.height()) / 2,
			bottomMargin = parseInt($dialog.css('marginBottom'), 10);

		// Make sure you don't hide the top part of the modal w/ a negative margin if it's longer than the screen height, and keep the margin equal to the bottom margin of the modal
		if (offset < bottomMargin) offset = bottomMargin;
		$dialog.css("margin-top", offset);
	}

	$(document).on('show.bs.modal', '.modal', centerModal);
	$(window).on("resize", function () {
		$('.modal:visible').each(centerModal);
	});
}(jQuery));