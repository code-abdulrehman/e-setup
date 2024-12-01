<!-- EditProfile.vue -->
<template>
    <Panel header="Edit Profile" class="edit-profile-panel">
        <form @submit.prevent="saveProfile" class="p-fluid">
            
            <!-- Grid for First Name and Last Name -->
            <div class="grid gap-4 md:grid-cols-2">
                
                <!-- First Name -->
                <div class="field">
                    <label for="firstName">First Name</label>
                    <InputText id="firstName" v-model="localUser.first_name" required />
                </div>
                
                <!-- Last Name -->
                <div class="field">
                    <label for="lastName">Last Name</label>
                    <InputText id="lastName" v-model="localUser.last_name" required />
                </div>
            </div>
            
            <!-- Grid for Username and Email -->
            <div class="grid gap-4 md:grid-cols-2">
                
                <!-- Username (Disabled) -->
                <div class="field">
                    <label for="username">Username</label>
                    <InputText id="username" v-model="localUser.username" disabled />
                </div>
                
                <!-- Email (Disabled) -->
                <div class="field">
                    <label for="email">Email</label>
                    <InputText id="email" v-model="localUser.email" type="email" disabled />
                </div>
                
            </div>

            <!-- Grid for Country and Role -->
            <div class="grid gap-4 md:grid-cols-2">
                
                <!-- Country -->
                <div class="field">
                    <label for="country">Country</label>
                    <InputText id="country" v-model="localUser.country" />
                </div>
                
                <!-- Role (Disabled) with Change Role Button -->
                <div class="field">
                    <label for="role">Role</label>
                    <div class="role-field">
                        <InputText id="role" v-model="localUser.role" disabled />
                        <Button 
                            icon="pi pi-cog" 
                            class="p-button-rounded p-button-outlined" 
                            @click="showRoleDialogHandler"
                            aria-label="Change Role" 
                        />
                    </div>
                </div>
                
            </div>
            
            <!-- Grid for Skill and Per Hour Pay -->
            <div class="grid gap-4 md:grid-cols-2">
                
                <!-- Skill -->
                <div class="field">
                    <label for="skill">Skill</label>
                    <InputText id="skill" v-model="localUser.skill" />
                </div>
                
                <!-- Per Hour Pay -->
                <div class="field">
                    <label for="per_hour_pay">Per Hour Pay</label>
                    <InputText id="per_hour_pay" v-model="localUser.per_hour_pay" type="number" />
                </div>
            </div>
            
            <!-- National ID -->
            <div class="field">
                <label for="national_id">National ID</label>
                <InputText id="national_id" v-model="localUser.national_id" />
            </div>
            
            <!-- About -->
            <div class="field">
                <label for="about">About</label>
                <Textarea id="about" v-model="localUser.about" rows="5" autoResize />
            </div>
            
            <!-- Expertise -->
            <div class="field">
                <label for="expertise">Expertise</label>
                <Chips 
                    id="expertise" 
                    v-model="localUser.expertise" 
                    separator="," 
                    placeholder="Add expertise and press Enter or Comma" 
                />
            </div>
            
            <!-- Last Online (Disabled) -->
            <div class="field">
                <label for="lastOnline">Last Online</label>
                <InputText id="lastOnline" v-model="formattedLastOnline" disabled />
            </div>
            
            <!-- Peer ID (Disabled) -->
            <div class="field">
                <label for="peerId">Peer ID</label>
                <InputText id="peerId" v-model="localUser.peerId" disabled />
            </div>
            
            <!-- Save Changes Button -->
            <Button type="submit" label="Save Changes" icon="pi pi-save" />
        </form>

        <!-- Role Change Dialog -->
        <Dialog 
            v-model:visible="roleDialog" 
            header="Request Role Change" 
            :modal="true" 
            :closable="true"
            :responsive="true" 
            aria-labelledby="role-change-dialog"
        >
            <div class="role-dialog-content">
                <h4>Select New Role</h4>
                
                <!-- Optional: Display Current Role (Disabled) -->
                <div class="field">
                    <label for="currentRole">Current Role</label>
                    <InputText id="currentRole" v-model="localUser.role" disabled />
                </div>
                
                <!-- Select New Role -->
                <div class="field-radiobutton">
                    <RadioButton 
                        inputId="role-super_admin" 
                        v-model="newRole" 
                        name="role" 
                        value="super_admin" 
                    />
                    <label for="role-super_admin">Super Admin</label>
                </div>
                <div class="field-radiobutton">
                    <RadioButton 
                        inputId="role-admin"  
                        v-model="newRole" 
                        name="role" 
                        value="admin" 
                    />
                    <label for="role-admin">Admin</label>
                </div>
                <div class="field-radiobutton">
                    <RadioButton 
                        inputId="role-user"  
                        v-model="newRole" 
                        name="role" 
                        value="user" 
                    />
                    <label for="role-user">User</label>
                </div>
                
                <!-- Submit Request Button -->
                <Button 
                    label="Submit Request" 
                    icon="pi pi-check" 
                    @click="submitRoleRequest" 
                    class="mt-3" 
                />
            </div>
        </Dialog>
    </Panel>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useToast } from 'primevue/usetoast';

// PrimeVue Components
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';
import Textarea from 'primevue/textarea'; // Import Textarea
import Chips from 'primevue/chips'; // Import Chips

// Props
const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});

// Emits
const emit = defineEmits(['saveProfile', 'showRoleDialog']);

// Initialize Toast
const toast = useToast();

// Local copy of user data to allow editing
const localUser = ref({ 
    ...props.user,
    about: props.user.about || '', // Initialize 'about'
    expertise: props.user.expertise || [], // Initialize 'expertise' as an array
});

// Dialog visibility
const roleDialog = ref(false);

// New role to request
const newRole = ref(null);

// Computed property to format 'last_online' date
const formattedLastOnline = computed(() => {
    const date = new Date(localUser.value.last_online);
    return date.toLocaleString(); // Adjust the format as needed
});

// Watch for prop changes and update localUser accordingly
watch(() => props.user, (newVal) => {
    localUser.value = { 
        ...newVal,
        about: newVal.about || '',
        expertise: newVal.expertise || [],
    };
});

// Show Role Dialog
const showRoleDialogHandler = () => {
    console.log("Opening role dialog");
    roleDialog.value = true;
    emit('showRoleDialog');
};

// Submit Role Change Request
const submitRoleRequest = () => {
    if (!newRole.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please select a role before submitting.',
            life: 3000
        });
        return;
    }

    console.log('Role change requested:', newRole.value);

    // Simulate API call with a timeout
    setTimeout(() => {
        // Assuming the role change request is successful
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role change request submitted successfully.',
            life: 3000
        });

        // Reset the newRole and close the dialog after submitting
        newRole.value = null;
        roleDialog.value = false;
    }, 1000);

    // In a real application, replace the above setTimeout with an actual API call
    /*
    axios.post('/api/request-role-change', { 
        userId: localUser.value._id, 
        newRole: newRole.value 
    })
    .then(response => {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role change request submitted successfully.',
            life: 3000
        });
        newRole.value = null;
        roleDialog.value = false; 
    })
    .catch(error => {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit role change request.',
            life: 3000
        });
        console.error(error);
    });
    */
};

// Save profile function
const saveProfile = () => {
    console.log('Profile saved:', localUser.value);

    // Simulate API call with a timeout
    setTimeout(() => {
        // Emit the updated user data to the parent component
        emit('saveProfile', { ...localUser.value });
    }, 1000);

    // In a real application, replace the above setTimeout with an actual API call
    /*
    axios.put(`/api/users/${localUser.value._id}`, localUser.value)
    .then(response => {
        emit('saveProfile', { ...localUser.value });
    })
    .catch(error => {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update profile.',
            life: 3000
        });
        console.error(error);
    });
    */
};
</script>

<style scoped>
.field {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

.p-panel {
    margin-bottom: 1.5rem;
}

.edit-profile-panel {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem; /* Adjusted for better spacing */
}

.role-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.role-dialog-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.field-radiobutton {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.mt-3 {
    margin-top: 1rem;
}

.grid {
    display: grid;
}

.gap-4 {
    gap: 1rem;
}

.md\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
}
</style>
