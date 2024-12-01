<!-- src/components/Profile/Dialog/PatternDialog.vue -->
<template>
  <Dialog
    header="Select a Pattern or Image"
    :visible="visible"
    @update:visible="handleUpdateVisible"
    :modal="true"
    :closable="true"
    maximizable
    :style="{ minWidth: '60vw' }"
  >
    <!-- Patterns Section -->
    <div class="selection-section">
      <h3>Patterns</h3>
      <div class="flex flex-wrap justify-between gap-4">
        <div
          v-for="index in totalPatterns"
          :key="`pattern-${index}`"
          :class="['pattern-box w-full md:w-[48%] xl:w-[32%] h-20', `pattern-${index}`, { selected: selectedPattern === index }]"
          @click="selectPattern(index)"
          role="button"
          tabindex="0"
          @keydown.enter.space.prevent="selectPattern(index)"
          :aria-label="`Select Pattern ${index}`"
        ></div>
      </div>
    </div>

    <!-- Images Section -->
    <div class="selection-section">
      <h3>Images</h3>
      <div class="flex flex-wrap justify-between gap-4">
        <div
          v-for="index in totalImages"
          :key="`image-${index}`"
          :class="['image-box w-full md:w-[48%] xl:w-[32%] h-20', { selected: selectedImage === index }]"
          :style="{ backgroundImage: `url('/public/demo/images/banners/banner-${index}.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }"
          @click="selectImage(index)"
          role="button"
          tabindex="0"
          @keydown.enter.space.prevent="selectImage(index)"
          :aria-label="`Select Image ${index}`"
        ></div>
      </div>
    </div>

    <!-- Dialog Footer with Save and Cancel Buttons -->
    <div class="dialog-footer">
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-text"
        @click="emit('update:visible', false)"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        :disabled="!selectionMade"
        @click="saveSelection"
      />
    </div>
  </Dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  totalPatterns: {
    type: Number,
    default: 22,
  },
  totalImages: {
    type: Number,
    default: 4,
  },
});

const emit = defineEmits(['update:visible', 'banner-selected']);

const selectedPattern = ref(null);
const selectedImage = ref(null);

// Handle visibility updates from the dialog
const handleUpdateVisible = (value) => {
  emit('update:visible', value);
};

// Select a pattern and clear image selection
const selectPattern = (index) => {
  selectedPattern.value = index;
  selectedImage.value = null;
};

// Select an image and clear pattern selection
const selectImage = (index) => {
  selectedImage.value = index; // Assuming you want to send the index
  selectedPattern.value = null;
};

// Check if a selection has been made
const selectionMade = computed(() => {
  return selectedPattern.value !== null || selectedImage.value !== null;
});

// Save the selected pattern or image
const saveSelection = () => {
  if (selectedPattern.value !== null) {
    emit('banner-selected', { type: 'pattern', value: selectedPattern.value });
  } else if (selectedImage.value !== null) {
    emit('banner-selected', { type: 'image', value: selectedImage.value });
  }
  emit('update:visible', false); // Close the dialog
};
</script>

<style scoped>
.selection-section {
  margin-bottom: 20px;
}

.selection-section h3 {
  margin-bottom: 10px;
  text-align: center;
}

.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.justify-between {
  justify-content: space-between;
}

.gap-4 {
  gap: 1rem;
}

.pattern-box, .image-box {
  cursor: pointer;
  border: 2px solid #ccc;
  border-radius: 4px;
  transition: transform 0.2s, border-color 0.2s;
}

.pattern-box.selected, .image-box.selected {
  border: 6px dashed #007bff;
}

.image-box {
  background-size: cover;
  background-position: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
