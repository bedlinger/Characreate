<template>
  <Card>
    <template #title>{{ persona.name }} - {{ persona.occupation }}</template>
    <template #content>
      <div class="grid grid-cols-3 gap-6">
        <div id="profile-picture" class="persona-info relative">
          <div
            class="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent rounded-2xl"
          ></div>
          <div class="absolute bottom-0 pl-1 pb-1">
            <p>Age: {{ persona.age }}</p>
            <p>Gender: {{ persona.gender }}</p>
            <p>Location: {{ persona.location }}</p>
          </div>
          <img
            :src="persona.profile_image"
            alt="Profile Picture"
            class="object-cover w-full h-56"
          />
        </div>
        <div id="motivation" class="persona-info">
          <div class="flex flex-col gap-2">
            <h5 class="text-xl">Motivation</h5>
            <p class="italic">{{ persona.motivation }}</p>
          </div>
        </div>
        <div id="hobbies-and-interests" class="persona-info">
          <div class="flex flex-col gap-2">
            <h5 class="text-xl">Hobbies and Interests</h5>
            <div class="flex flex-row flex-wrap gap-2">
              <Chip
                v-for="hobby in persona.hobbies_and_interests"
                :key="hobby"
                :label="hobby"
              />
            </div>
          </div>
        </div>
        <div id="goals" class="persona-info">
          <div class="flex flex-col gap-2">
            <h5 class="text-xl">Goals</h5>
            <div class="flex flex-row flex-wrap gap-2">
              <Chip v-for="goal in persona.goals" :key="goal" :label="goal" />
            </div>
          </div>
        </div>
        <div id="technical-experience" class="persona-info">
          <div class="flex flex-col gap-2">
            <h5 class="text-xl">Technical experience</h5>
            <p class="italic">{{ persona.technical_experience }}</p>
          </div>
        </div>
        <div id="challenges" class="persona-info">
          <div class="flex flex-col gap-2">
            <h5 class="text-xl">Challenges</h5>
            <div class="flex flex-row flex-wrap gap-2">
              <Chip
                v-for="challenge in persona.challenges"
                :key="challenge"
                :label="challenge"
              />
            </div>
          </div>
        </div>
      </div>
      <Divider></Divider>
      <div id="bio">
        <p class="italic text-center">{{ persona.biography }}</p>
      </div>
    </template>
  </Card>
</template>

<script setup>
defineProps({
  persona: Object,
});
</script>
