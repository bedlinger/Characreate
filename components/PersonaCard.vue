<template>
    <Card>
      <template #title>{{ persona.name }} - {{ persona.occupation }}</template>
      <template #content>
        <div class="grid grid-cols-3 gap-6">
          <div id="profile-picture">
            <div class="relative">
              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-300 to-transparent"
              ></div>
              <div class="absolute bottom-0 pl-1 pb-0.5">
                <p>Age: {{ persona.age }}</p>
                <p>Gender: {{ persona.gender }}</p>
                <p>Location: {{ persona.location }}</p>
              </div>
              <img
                :src="persona.profile_image"
                alt="Profile Picture"
                class="object-cover w-full h-52"
              />
            </div>
          </div>
          <div id="motivation">
            <div class="flex flex-col gap-2">
              <h5 class="text-xl">Motivation</h5>
              <p class="italic">{{ persona.motivation }}</p>
            </div>
          </div>
          <div id="hobbies-and-interests">
            <div class="flex flex-col gap-2">
              <h5 class="text-xl">Hobbies and Interests</h5>
              <ul>
                <li v-for="hobby in persona.hobbies_and_interests" :key="hobby">
                  {{ hobby }}
                </li>
              </ul>
            </div>
          </div>
          <div id="goals">
            <div class="flex flex-col gap-2">
              <h5 class="text-xl">Goals</h5>
              <ul>
                <li v-for="goal in persona.goals" :key="goal">
                  {{ goal }}
                </li>
              </ul>
            </div>
          </div>
          <div id="technical-experience">
            <div class="flex flex-col gap-2">
              <h5 class="text-xl">Technical experience</h5>
              <p class="italic">{{ persona.technical_experience }}</p>
            </div>
          </div>
          <div id="challenges">
            <div class="flex flex-col gap-2">
              <h5 class="text-xl">Challenges</h5>
              <ul>
                <li v-for="challenge in persona.challenges" :key="challenge">
                  {{ challenge }}
                </li>
              </ul>
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