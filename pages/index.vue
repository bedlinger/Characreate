<template>
  <ClientOnly>
    <Toast />
  </ClientOnly>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-12">
        <blockquote
          class="text-2xl text-gray-600 italic font-light mb-6 leading-relaxed"
        >
          "The purpose of personas is to create reliable and realistic
          representations of your key audience segments for reference."
        </blockquote>
        <h1 class="text-4xl font-bold text-gray-900">Create Your Persona</h1>
      </div>
      <ClientOnly>
        <Card v-if="usageStatus" class="mb-4">
          <template #content>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-900">
                  Weekly Usage
                </h3>
                <span
                  class="text-sm font-medium px-3 py-1 rounded-full"
                  :class="getUsageStatusClass('badge')"
                >
                  {{ usageStatus.currentCount }}/{{ usageStatus.limit }}
                </span>
              </div>
              <ProgressBar
                :value="
                  Math.round(
                    (usageStatus.currentCount / usageStatus.limit) * 100
                  )
                "
                :class="getUsageStatusClass('progress')"
              />
              <div class="flex justify-between text-sm">
                <span :class="getUsageStatusClass('text')">
                  {{ usageStatus.remaining }} remaining
                </span>
                <span
                  v-if="usageStatus.resetTime"
                  :class="getUsageStatusClass('text')"
                >
                  Resets:
                  {{ new Date(usageStatus.resetTime).toLocaleDateString() }}
                </span>
              </div>
              <Message
                v-if="usageStatus.limitReached"
                severity="error"
                :closable="false"
              >
                Weekly limit reached. Please try again next week.
              </Message>
              <Message
                v-else-if="usageStatus.remaining <= 10"
                severity="warn"
                :closable="false"
              >
                Approaching weekly limit.
                {{ usageStatus.remaining }} generations remaining.
              </Message>
            </div>
          </template>
        </Card>
      </ClientOnly>
      <Card>
        <template #content>
          <Form
            @submit="fetchPersonaData()"
            class="space-y-8 p-4"
            @keydown.prevent.enter
          >
            <div class="form-field">
              <FloatLabel>
                <Textarea
                  v-model="projectIdea"
                  id="projectIdea"
                  rows="4"
                  :maxlength="735"
                  :invalid="errorProjectIdea.isError"
                  class="w-full"
                />
                <label for="projectIdea">Project Idea</label>
              </FloatLabel>
              <small v-if="errorProjectIdea.isError" class="text-red-500">
                {{ errorProjectIdea.message }}
              </small>
            </div>
            <div class="form-field">
              <FloatLabel>
                <Textarea
                  v-model="group"
                  id="group"
                  rows="4"
                  :maxlength="735"
                  :invalid="errorGroup.isError"
                  class="w-full"
                />
                <label for="group">Target Group</label>
              </FloatLabel>
              <small v-if="errorGroup.isError" class="text-red-500">
                {{ errorGroup.message }}
              </small>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-field">
                <FloatLabel>
                  <InputNumber
                    v-model="age"
                    id="age"
                    :min="MIN_AGE"
                    :max="MAX_AGE"
                    showButtons
                    :invalid="errorAge.isError"
                    class="w-full"
                  />
                  <label for="age">Age</label>
                </FloatLabel>
                <small v-if="errorAge.isError" class="text-red-500">
                  {{ errorAge.message }}
                </small>
              </div>
              <div class="form-field">
                <FloatLabel>
                  <Select
                    v-model="gender"
                    id="gender"
                    :options="GENDER"
                    :invalid="errorGender.isError"
                    class="w-full"
                  />
                  <label for="gender">Gender</label>
                </FloatLabel>
                <small v-if="errorGender.isError" class="text-red-500">
                  {{ errorGender.message }}
                </small>
              </div>
            </div>
            <div class="form-field">
              <FloatLabel>
                <InputGroup>
                  <InputText
                    v-model="goal"
                    id="goal"
                    :maxlength="65"
                    @keydown.enter="addGoal()"
                    :invalid="errorGoals.isError"
                    class="flex-1"
                  />
                  <label for="goal">Goals</label>
                  <InputGroupAddon>
                    <Button
                      @click="addGoal()"
                      class="w-full h-full"
                      severity="secondary"
                      :disabled="goals.length >= MAX_GOALS || !goal.trim()"
                    >
                      <Icon name="mdi:plus-circle-outline" />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <label for="goal"
                  >Goals ({{ goals.length }}/{{ MAX_GOALS }})</label
                >
              </FloatLabel>
              <small v-if="errorGoals.isError" class="text-red-500">
                {{ errorGoals.message }}
              </small>
              <div v-if="goals.length > 0" class="flex flex-wrap gap-2 mt-3">
                <Chip
                  v-for="(goalItem, index) in goals"
                  :key="index"
                  :label="goalItem"
                  removable
                  @remove="removeGoal(index)"
                />
              </div>
            </div>
            <div class="flex justify-center">
              <Button
                type="submit"
                :loading="loading"
                :disabled="usageStatus?.limitReached || loading"
                label="Create Persona"
                size="large"
              />
            </div>
          </Form>
        </template>
      </Card>
    </div>
  </div>
  <Dialog
    v-model:visible="showPersonaCard"
    header="Your Persona"
    :modal="true"
    :draggable="false"
    class="w-7/12"
  >
    <div class="space-y-6">
      <PersonaCard id="persona-card" :persona="persona" />
      <div class="flex justify-center">
        <Button
          label="Export Persona Card"
          icon="pi pi-download"
          @click="exportPersonaCard()"
          class="px-8"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
const toast = useToast();
const loading = ref(false);

const usageStatus = ref(null);

const fetchUsageStatus = async () => {
  try {
    const response = await $fetch("/api/usage");
    usageStatus.value = response;
  } catch (error) {
    console.error("Error fetching usage status:", error);
  }
};

onMounted(() => {
  fetchUsageStatus();
  age.value = Math.floor(Math.random() * (35 - 18 + 1)) + 18;
  gender.value = GENDER.value[Math.floor(Math.random() * GENDER.value.length)];
});

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
const age = ref(25);
const errorAge = computed(() => ({
  isError: !age.value || age.value < MIN_AGE || age.value > MAX_AGE,
  message:
    age.value < MIN_AGE || age.value > MAX_AGE
      ? `Age must be between ${MIN_AGE} and ${MAX_AGE}`
      : "Age is required",
}));

const GENDER = ref(["not necessary", "male", "female", "other"]);
const gender = ref("not necessary");
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

  try {
    loading.value = true;
    const response = await $fetch("/api/generate", {
      method: "POST",
      body: {
        projectIdea: projectIdea.value,
        group: group.value,
        age: age.value,
        gender: gender.value,
        goals: goals.value,
      },
    });

    if (response.success) {
      persona.value = response.persona;
      showPersonaCard.value = true;

      usageStatus.value = {
        currentCount: response.usage.currentCount,
        limit: response.usage.limit,
        remaining: response.usage.remaining,
        resetTime: usageStatus.value?.resetTime,
      };

      toast.add({
        severity: "success",
        summary: "Persona Generated",
        detail: `Generated successfully! ${response.usage.remaining} generations remaining this week.`,
        life: 3000,
      });
    } else {
      throw new Error("Failed to generate persona");
    }
  } catch (error) {
    console.error("Error generating persona:", error);

    if (error.statusCode === 429) {
      toast.add({
        severity: "warn",
        summary: "Weekly Limit Reached",
        detail:
          error.statusMessage ||
          "Weekly persona generation limit reached. Please try again next week.",
        life: 5000,
      });
    } else if (error.statusCode === 400) {
      toast.add({
        severity: "error",
        summary: "Invalid Data",
        detail: "Please check your input and try again.",
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail:
          error.statusMessage ||
          "Failed to generate persona! Please try again.",
        life: 3000,
      });
    }
  } finally {
    loading.value = false;
  }
};

const { $htmlToImage } = useNuxtApp();
const exportPersonaCard = () => {
  $htmlToImage
    .toPng(document.getElementById("persona-card"))
    .then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = "persona-card.png";
      link.href = dataUrl;
      link.click();
    });

  showPersonaCard.value = false;
  persona.value = null;
};

const getUsageStatusClass = (type) => {
  if (!usageStatus.value) return "";

  const isLimitReached = usageStatus.value.limitReached;
  const isLowRemaining = usageStatus.value.remaining <= 10 && !isLimitReached;
  const isNormal = usageStatus.value.remaining > 10;

  const classes = {
    badge: {
      "bg-red-100 text-red-800": isLimitReached,
      "bg-yellow-100 text-yellow-800": isLowRemaining,
      "bg-blue-100 text-blue-800": isNormal,
    },
    progress: {
      "text-red-500": isLimitReached,
      "text-yellow-500": isLowRemaining,
      "text-blue-500": isNormal,
    },
    text: {
      "text-red-600": isLimitReached,
      "text-yellow-600": isLowRemaining,
      "text-blue-600": isNormal,
    },
  };

  return classes[type];
};
</script>

<style>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
