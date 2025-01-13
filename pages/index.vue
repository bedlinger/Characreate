<template>
  <div class="flex flex-col text-center gap-6">
    <h2 class="text-3xl text-center italic px-48">
      "The purpose of personas is to create reliable and realistic
      representations of your key audience segments for reference."
    </h2>
    <h3 class="text-2xl font-bold">Create your persona</h3>
    <div class="card flex justify-center">
      <Form
        @submit="createPersona()"
        class="flex flex-col gap-9 w-1/3"
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
                :maxlength="365"
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
                :maxlength="365"
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
                  :options="genders"
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
                    :disabled="goals.length >= maxNumberOfGoals"
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
          label="Create Persona"
          class="w-1/2 self-center"
        />
      </Form>
    </div>
  </div>
</template>

<script setup>
const projectIdea = ref(
  "An innovative app that connects young travelers with sustainable travel opportunities"
);
const group = ref(
  "Eco-conscious individuals aged 18-35, predominantly students or young professionals interested in exploring new cultures while minimizing their environmental impact."
);
const age = ref(Math.floor(Math.random() * (35 - 18 + 1)) + 18);
const minAge = 14;
const maxAge = 100;
const genders = ref(["not necessary", "male", "female", "other"]);
const gender = ref(
  genders.value[Math.floor(Math.random() * genders.value.length)]
);
const goal = ref("");
const goals = ref([
  "Find affordable and sustainable travel options",
  "Connect with like-minded travelers",
  "Learn more about local cultures through eco-tourism",
]);
const maxNumberOfGoals = 5;

const errorProjectIdea = computed(() => ({
  isError: !projectIdea.value,
  message: "Project Idea is required",
}));

const errorGroup = computed(() => ({
  isError: !group.value,
  message: "Target Group is required",
}));

const errorAge = computed(() => ({
  isError: !age.value || age.value < minAge || age.value > maxAge,
  message:
    age.value < minAge || age.value > maxAge
      ? `Age must be between ${minAge} and ${maxAge}`
      : "Age is required",
}));

const errorGender = computed(() => ({
  isError: !gender.value,
  message: "Gender is required",
}));

const errorGoals = computed(() => ({
  isError: goals.value.length <= 0,
  message: "At least one goal is required",
}));

const addGoal = () => {
  if (goals.value.length < maxNumberOfGoals && goal.value) {
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

const config = useRuntimeConfig();

const createPersona = async () => {
  if (hasError.value) {
    alert("Please fill out all required fields");
  }

  const prompt = "ADD PROMPT HERE";

  await $fetch(config.public.apiUrl, {
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
          content: "You are",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    },
  })
    .catch((error) => {
      console.error("Error:", error);
    })
    .then((response) => {
      console.log("Success:", response);
    });
};
</script>
