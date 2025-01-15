<template>
  <Toast />
  <div class="flex flex-col text-center gap-6">
    <h2 class="text-3xl text-center italic px-48">
      "The purpose of personas is to create reliable and realistic
      representations of your key audience segments for reference."
    </h2>
    <h3 class="text-2xl font-bold">Create your persona</h3>
    <div class="card flex justify-center">
      <Form
        @submit="fetchPersonaData()"
        class="flex flex-col gap-9 w-2/3"
        @keydown.prevent.enter
      >
        <div class="card flex justify-center">
          <div class="flex flex-col w-full">
            <FloatLabel class="w-full flex flex-col">
              <Textarea
                v-model="projectIdea"
                name="projectIdea"
                v-tooltip.right="'Describe your project idea'"
                rows="5"
                :maxlength="735"
                :invalid="errorProjectIdea.isError"
                class="w-full resize-none"
              />
              <label for="projectIdea">Project Idea</label>
            </FloatLabel>
            <Message
              v-if="errorProjectIdea.isError"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ errorProjectIdea.message }}
            </Message>
          </div>
        </div>
        <div class="card flex justify-center">
          <div class="flex flex-col w-full">
            <FloatLabel class="w-full flex flex-col">
              <Textarea
                v-model="group"
                name="group"
                v-tooltip.right="'Describe your target group'"
                rows="5"
                :maxlength="735"
                :invalid="errorGroup.isError"
                class="w-full resize-none"
              />
              <label for="group">Target Group</label>
            </FloatLabel>
            <Message
              v-if="errorGroup.isError"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ errorGroup.message }}
            </Message>
          </div>
        </div>
        <div class="flex flex-row gap-4 w-full justify-evenly">
          <div class="card flex justify-center w-full">
            <div class="flex flex-col w-full">
              <FloatLabel class="w-full flex flex-col">
                <InputNumber
                  v-model="age"
                  name="age"
                  v-tooltip.right="'Enter the age of the persona'"
                  :min="0"
                  :max="100"
                  showButtons
                  :invalid="errorAge.isError"
                  class="w-full"
                />
                <label for="age">Age</label>
              </FloatLabel>
              <Message
                v-if="errorAge.isError"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ errorAge.message }}
              </Message>
            </div>
          </div>
          <div class="card flex justify-center w-full">
            <div class="flex flex-col w-full">
              <FloatLabel class="w-full flex flex-col">
                <Select
                  v-model="gender"
                  name="gender"
                  v-tooltip.right="
                    'Select the gender of the persona if necessary'
                  "
                  :options="GENDER"
                  :invalid="errorGender.isError"
                  class="w-full text-left"
                />
                <label for="gender">Gender</label>
              </FloatLabel>
              <Message
                v-if="errorGender.isError"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ errorGender.message }}
              </Message>
            </div>
          </div>
        </div>
        <div class="card flex justify-center">
          <div class="flex flex-col w-full">
            <FloatLabel class="w-full flex flex-col">
              <InputGroup v-tooltip.right="'Add Goals that you want to reach'">
                <InputText
                  v-model="goal"
                  name="goal"
                  class="w-full"
                  :maxlength="65"
                  @keydown.enter="addGoal()"
                  :invalid="errorGoals.isError"
                />
                <label for="goal">Goals</label>
                <InputGroupAddon>
                  <Button
                    @click="addGoal()"
                    class="w-full h-full"
                    severity="secondary"
                    :disabled="goals.length >= MAX_GOALS"
                  >
                    <Icon name="mdi:plus-circle-outline" />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </FloatLabel>
            <Message
              v-if="errorGoals.isError"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ errorGoals.message }}
            </Message>
            <div class="flex flex-row flex-wrap gap-4 pt-2">
              <div v-for="(goal, index) in goals" :key="goal + index">
                <Chip :label="goal" removable @remove="removeGoal(index)" />
              </div>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          :loading="loading"
          label="Create Persona"
          class="w-1/2 self-center"
        />
      </Form>
    </div>
  </div>
  <Dialog
    v-model:visible="showPersonaCard"
    header="Your Persona"
    :modal="true"
    :draggable="false"
    class="w-5/6"
  >
  <div class="flex flex-col gap-6">
    <PersonaCard :persona="persona" />
    <Button
        label="Export Persona Card"
        class="w-1/2 self-center"
        @click="exportPersonaCard()"
      />
  </div>
  </Dialog>
</template>

<script setup>
const toast = useToast();
const config = useRuntimeConfig();
const loading = ref(false);

const projectIdea = ref(
  "An innovative app that connects young travelers with sustainable travel opportunities"
);
const errorProjectIdea = computed(() => ({
  isError: !projectIdea.value,
  message: "Project Idea is required",
}));

const group = ref(
  "Eco-conscious individuals aged 18-35, predominantly students or young professionals interested in exploring new cultures while minimizing their environmental impact."
);
const errorGroup = computed(() => ({
  isError: !group.value,
  message: "Target Group is required",
}));

const MIN_AGE = 14;
const MAX_AGE = 100;
const age = ref(Math.floor(Math.random() * (35 - 18 + 1)) + 18);
const errorAge = computed(() => ({
  isError: !age.value || age.value < MIN_AGE || age.value > MAX_AGE,
  message:
    age.value < MIN_AGE || age.value > MAX_AGE
      ? `Age must be between ${MIN_AGE} and ${MAX_AGE}`
      : "Age is required",
}));

const GENDER = ref(["not necessary", "male", "female", "other"]);
const gender = ref(
  GENDER.value[Math.floor(Math.random() * GENDER.value.length)]
);
const errorGender = computed(() => ({
  isError: !gender.value,
  message: "Gender is required",
}));

const goal = ref("");
const goals = ref([
  "Find affordable and sustainable travel options",
  "Connect with like-minded travelers",
  "Learn more about local cultures through eco-tourism",
]);
const MAX_GOALS = 5;
const errorGoals = computed(() => ({
  isError: goals.value.length <= 0,
  message: "At least one goal is required",
}));
const addGoal = () => {
  if (goals.value.length < MAX_GOALS && goal.value) {
    goals.value.push(goal.value);
    goal.value = "";
  }
};
const removeGoal = (index) => {
  const updatedGoals = [...goals.value];
  updatedGoals.splice(index, 1);
  goals.value = updatedGoals;
};

const hasError = computed(() =>
  [errorProjectIdea, errorGroup, errorAge, errorGender, errorGoals].some(
    (error) => error.value.isError
  )
);

const systemPrompt = `
    You are an AI system tasked with generating detailed personas based on user input. A persona is a fictional representation of a target user group designed to facilitate empathy and understanding for product design and usability testing.
    Follow these guidelines:
    - Accept input for Project Idea, Target Group, Age, Gender, and Goals.
    - Generate a persona with details: Name, Age, Gender, Location, Occupation, Biography, Hobbies and Interests, Technical Experience, Goals, Motivation, and Challenges.
    - Provide the response in the following JSON format:
    {
      "persona": {
        "name": "String",
        "age": Integer,
        "gender": "String",
        "location": "String",
        "occupation": "String",
        "biography": "String",
        "hobbies_and_interests": ["String"],
        "technical_experience": "String",
        "goals": ["String"],
        "motivation": "String",
        "challenges": ["String"]
      }
    }
    Ensure the response adheres strictly to this format and includes all fields.
  `;
const userPrompt = computed(() => {
  return `
    Generate a persona for the following:
    - Project Idea: ${projectIdea.value}
    - Target Group: ${group.value}
    - Age: ${age.value}
    - Gender: ${gender.value}
    - Goals: ${JSON.stringify(goals.value)}
    Respond in JSON format as specified.
  `;
});

const persona = ref(null);
const showPersonaCard = ref(false);
const fetchPersonaData = async () => {
  if (hasError.value) {
    toast.add({
      severity: "warn",
      summary: "Warning",
      detail: "Please fill in all required fields",
      life: 3000,
    });
    return;
  }

  const response = await $fetch(config.public.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.public.apiKey}`,
    },
    body: {
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        {
          role: "system",
          content: systemPrompt.trim(),
        },
        {
          role: "user",
          content: userPrompt.value.trim(),
        },
      ],
      response_format: { type: "json_object" },
    },
    async onRequest({ request, options }) {
      // console.log("[fetch request]", request, options);
      loading.value = true;
    },
    async onRequestError({ request, options, error }) {
      // console.log("[fetch request error]", request, error);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to generate persona! Please try again.",
        life: 3000,
      });
      loading.value = false;
      return;
    },
    async onResponse({ request, response, options }) {
      // console.log("[fetch response]", request, response.status, response.body);
      if (response.status !== 200) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: `Failed to generate persona with an response status of ${response.status}! Please try again.`,
          life: 3000,
        });
        loading.value = false;
        return;
      }
      loading.value = false;
    },
  });

  const personaAsString = response.choices[0].message.content;
  persona.value = JSON.parse(personaAsString).persona;
  persona.value.profile_image = `https://ui-avatars.com/api/?name${persona.value.name.replace(
    " ",
    "+"
  )}`;
  showPersonaCard.value = true;
};
</script>
