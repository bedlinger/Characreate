<template>
  <div class="flex flex-col text-center gap-6">
    <h2 class="text-3xl text-center italic px-48">
      "The purpose of personas is to create reliable and realistic
      representations of your key audience segments for reference."
    </h2>
    <h3 class="text-2xl font-bold">Create your persona</h3>
    <div class="card flex justify-center">
      <Form
        v-slot="$form"
        @submit="onFormSubmit"
        class="flex flex-col gap-7 w-1/3"
      >
        <div class="card flex justify-center">
          <FloatLabel class="w-full">
            <Textarea
              v-model="projectIdea"
              name="projectIdea"
              v-tooltip.rigth="'Describe your project idea'"
              rows="5"
              autoResize
              class="w-full"
            />
            <label for="projectIdea">Project Idea</label>
            <Message
              v-if="$form.projectIdea?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.projectIdea.error?.message }}</Message
            >
          </FloatLabel>
        </div>
        <div class="card flex justify-center">
          <FloatLabel class="w-full">
            <Textarea
              v-model="group"
              name="group"
              v-tooltip.rigth="'Describe your target group'"
              rows="5"
              autoResize
              class="w-full"
            />
            <label for="group">Target Group</label>
            <Message
              v-if="$form.group?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.group.error?.message }}</Message
            >
          </FloatLabel>
        </div>
        <div class="card flex justify-center">
          <FloatLabel class="w-full">
            <InputNumber
              v-model="age"
              name="age"
              v-tooltip.rigth="'Enter the age of the persona'"
              :min="0"
              :max="100"
              showButtons
              class="w-full"
            />
            <label for="age">Age</label>
            <Message
              v-if="$form.age?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.age.error?.message }}</Message
            >
          </FloatLabel>
        </div>
        <div class="card flex justify-center">
          <FloatLabel class="w-full">
            <Select
              v-model="gender"
              name="gender"
              v-tooltip.rigth="'Select the gender of the persona if necessary'"
              :options="genders"
              class="w-full"
            />
            <label for="gender">Gender</label>
            <Message
              v-if="$form.gender?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.gender.error?.message }}</Message
            >
          </FloatLabel>
        </div>
        <div class="card flex justify-center">
          <div class="flex flex-col gap-2 w-full">
            <FloatLabel>
              <InputGroup v-tooltip.rigth="'Add Goals that you want to reach'">
                <InputText v-model="goal" name="goal" class="w-full" />
                <label for="goal">Goals</label>
                <InputGroupAddon>
                  <Button
                    @click="addGoal()"
                    class="w-full h-full"
                    severity="secondary"
                    ><Icon name="mdi:check"
                  /></Button>
                </InputGroupAddon>
              </InputGroup>
              <Message
                v-if="$form.goals?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.age.goals?.message }}</Message
              >
            </FloatLabel>
            <div class="flex flex-row flex-wrap gap-4">
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
        <Button type="submit" label="Submit" />
      </Form>
    </div>
  </div>
</template>

<script setup>
const genders = ref(["not necessary", "male", "female", "other"]);
const projectIdea = ref("");
const group = ref("");
const age = ref(0);
const gender = ref("");
const goal = ref("");
const goals = ref([]);


const addGoal = () => {
  if (goal.value) {
    goals.value = [...goals.value, goal.value];
    goal.value = "";
  }
};
const removeGoal = (index) => {
  goals.value = goals.value.filter((_, i) => i !== index);
};

const onFormSubmit = ({ valid }) => {
  if (valid) {
    alert("Form submitted successfully!");
  }
};
</script>
