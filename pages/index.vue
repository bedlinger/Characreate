<template>
  <div class="flex flex-col text-center gap-6">
    <h2 class="text-3xl text-center italic px-48">
      "The purpose of personas is to create reliable and realistic
      representations of your key audience segments for reference."
    </h2>
    <h3 class="text-2xl font-bold">Create your persona</h3>
    <div class="card flex justify-center">
      <Form @submit="createPersona()" class="flex flex-col gap-9 w-1/3" @keydown.prevent.enter>
        <div class="card flex justify-center">
          <div class="flex flex-col w-full">
            <FloatLabel class="w-full flex flex-col">
              <Textarea
                v-model="projectIdea"
                name="projectIdea"
                v-tooltip.rigth="'Describe your project idea'"
                rows="5"
                autoResize
                :invalid="errorProjectIdea.isError"
                class="w-full"
              />
              <label for="projectIdea">Project Idea</label>
            </FloatLabel>
            <Message
              v-if="errorProjectIdea.isError"
              severity="error"
              size="small"
              variant="simple"
              >{{ errorProjectIdea.message }}</Message
            >
          </div>
        </div>
        <div class="card flex justify-center">
          <div class="flex flex-col w-full">
            <FloatLabel class="w-full flex flex-col">
              <Textarea
                v-model="group"
                name="group"
                v-tooltip.rigth="'Describe your target group'"
                rows="5"
                autoResize
                :invalid="errorGroup.isError"
                class="w-full"
              />
              <label for="group">Target Group</label>
            </FloatLabel>
            <Message
              v-if="errorGroup.isError"
              severity="error"
              size="small"
              variant="simple"
              >{{ errorGroup.message }}</Message
            >
          </div>
        </div>
        <div class="flex flex-row gap-4 w-full justify-evenly">
          <div class="card flex justify-center w-full">
            <div class="flex flex-col w-full">
              <FloatLabel class="w-full flex flex-col">
                <InputNumber
                  v-model="age"
                  name="age"
                  v-tooltip.rigth="'Enter the age of the persona'"
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
                >{{ errorAge.message }}</Message
              >
            </div>
          </div>
          <div class="card flex justify-center w-full">
            <div class="flex flex-col w-full">
              <FloatLabel class="w-full flex flex-col">
                <Select
                  v-model="gender"
                  name="gender"
                  v-tooltip.rigth="
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
                >{{ errorGender.message }}</Message
              >
            </div>
          </div>
        </div>
        <div class="card flex justify-center">
          <div class="flex flex-col w-full">
            <FloatLabel class="w-full flex flex-col">
              <InputGroup v-tooltip.rigth="'Add Goals that you want to reach'">
                <InputText
                  v-model="goal"
                  name="goal"
                  class="w-full"
                  @keydown.enter="addGoal()"
                  :invalid="errorGoals.isError"
                />
                <label for="goal">Goals</label>
                <InputGroupAddon>
                  <Button
                    @click="addGoal()"
                    class="w-full h-full"
                    severity="secondary"
                    ><Icon name="mdi:plus-circle-outline"
                  /></Button>
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
              <Chip
                v-for="(goal, index) in goals"
                :key="index"
                :label="goal"
                removable
                @remove="removeGoal(index)"
              />
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
const projectIdea = ref("test");
const errorProjectIdea = computed(() => {
  if (!projectIdea.value) {
    return { isError: true, message: "Project Idea is required" };
  }
  return { isError: false, message: "" };
});

const group = ref("test");
const errorGroup = computed(() => {
  if (!group.value) {
    return { isError: true, message: "Target Group is required" };
  }
  return { isError: false, message: "" };
});

const age = ref(Math.floor(Math.random() * 101));
const errorAge = computed(() => {
  if (!age.value) {
    return { isError: true, message: "Age is required" };
  } else if (age.value < 0) {
    return { isError: true, message: "Age must be greater than 0" };
  } else if (age.value > 100) {
    return { isError: true, message: "Age must be less than 100" };
  }
  return { isError: false, message: "" };
});

const genders = ref(["not necessary", "male", "female", "other"]);
const gender = ref(
  genders.value[Math.floor(Math.random() * genders.value.length)]
);
const errorGender = computed(() => {
  if (!gender.value) {
    return { isError: true, message: "Gender is required" };
  }
  return { isError: false, message: "" };
});

const goal = ref("");
const goals = ref(["test"]);
const errorGoals = computed(() => {
  if (!goals.value.length) {
    return { isError: true, message: "Goals are required" };
  } else if (goals.value.length < 1) {
    return { isError: true, message: "At least one goal is required" };
  } else if (goals.value.length > 5) {
    return { isError: true, message: "Maximum of 5 goals are allowed" };
  }
  return { isError: false, message: "" };
});
const addGoal = () => {
  if (goals.value.length >= 5) {
    return;
  }
  if (goal.value) {
    goals.value = [...goals.value, goal.value];
    goal.value = "";
  }
};
const removeGoal = (index) => {
  goals.value = goals.value.filter((_, i) => i !== index);
};

const hasError = computed(() => {
  return (
    errorProjectIdea.value.isError ||
    errorGroup.value.isError ||
    errorAge.value.isError ||
    errorGender.value.isError ||
    errorGoals.value.isError
  );
});

const createPersona = () => {
  if (hasError.value) {
    return;
  }
  alert("Persona created");
};
</script>
