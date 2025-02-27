import React, { useState } from "react";import { config } from "../config";
import {
  FaDiceD20,
  FaCheck,
  FaScroll,
  FaUser,
  FaIdCard,
  FaPhoneAlt,
  FaShieldAlt,
  FaTimes,
  FaDharmachakra,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800/90 border-2 border-yellow-600/50 rounded-lg p-6 max-w-md w-full relative shadow-[0_0_15px_rgba(202,138,4,0.15)]"
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      <Icon size={20} />
    </div>
    <input
      {...props}
      className="shadow-inner appearance-none border-2 border-gray-600 rounded-lg w-full py-3 pl-12 pr-4 bg-gray-700/90 text-gray-100 leading-tight focus:outline-none focus:border-yellow-500 focus:shadow-[0_0_10px_rgba(202,138,4,0.2)] transition-all duration-300"
    />
  </div>
);

const RegistrationForm = ({ tableSlug, tableId }) => {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleLanguage, setRuleLanguage] = useState("EN");
  const backendUrl = config.backendUrl;

  const rules = {
    EN: [
      "1. Participants must be currently enrolled students.",
      "2. Respect all other participants and staff members.",
      "3. Follow the event schedule and guidelines.",
      "4. No cheating or unfair play is allowed.",
      "5. Do not carry any weapons or dangerous items to the event even though they are related to your cosplay.",
      "6. Have fun and embrace the spirit of role-playing without breaking the rules or bothering others.",
    ],
    TR: [
      "1. Katılımcılar kayıtlı öğrenci olmalıdır.",
      "2. Tüm diğer katılımcılara ve personele saygılı olun.",
      "3. Etkinlik programını ve yönergelerini takip edin.",
      "4. Hile yapmak veya haksız oyun oynamak yasaktır.",
      "5. Kostümle ilgili olsa bile etkinliğe silah veya tehlikeli eşya getirmeyin.",
      "6. Kuralları ihlal etmeden ve diğerlerini rahatsız etmeden rol yapma ruhunu benimseyin ve eğlenin.",
    ],
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("You must accept the EMURPG Event Rules and Privacy Policy.");
      return;
    }

    const response = await fetch(`${backendUrl}/api/register/${tableSlug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: studentId,
        name: name,
        table_id: tableId,
        contact: contact,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      alert(result.detail || "An error occurred during registration.");
    } else {
      alert("Your registration was successful!");
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleRuleLanguage = () =>
    setRuleLanguage(ruleLanguage === "EN" ? "TR" : "EN");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-2 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative select-none"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(202,138,4,0.1),transparent_50%)]" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="w-full max-w-md h-fit relative items-center ">
        {/* Header Section */}
        <div className="text-center mb-8 ">
          <motion.div
            animate={{
              scale: [1.2, 1.4, 1.2],
              rotate: [0, 360],
            }}
            style={{ transformOrigin: "center" }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="relative mx-auto"
          >
            <FaDharmachakra className="text-6xl text-yellow-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-3xl font-bold text-yellow-500 mb-2 my-10">
            Join the Adventure
          </h2>
          <p className="text-gray-400">Your quest awaits, brave adventurer!</p>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleRegister}
          className="bg-gray-800/90 shadow-[0_0_25px_rgba(0,0,0,0.3)] rounded-lg px-8 pt-8 pb-8 mb-4 border-2 border-yellow-500/30 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="space-y-6">
            <Input
              icon={FaIdCard}
              type="number"
              maxLength={8}
              placeholder="Student ID*"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />

            <Input
              icon={FaUser}
              type="text"
              placeholder="Name/Surname*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              icon={FaPhoneAlt}
              type="number"
              maxLength={15}
              placeholder="Contact Number (OPTIONAL)"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <div className="flex-shrink-0 mt-1">
                <FaShieldAlt className="text-yellow-500/50" />
              </div>
              <label className="text-sm text-gray-300 leading-tight">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-yellow-500 rounded border-gray-600 focus:ring-yellow-500 focus:ring-offset-gray-800 mr-2"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                I accept the{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-500 hover:text-yellow-400 underline"
                >
                  Privacy Policy
                </a>{" "}
                and the{" "}
                <span
                  onClick={() => setIsModalOpen(true)}
                  className="text-yellow-500 hover:text-yellow-400 underline cursor-pointer"
                >
                  Event Rules
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 
                         transition duration-300 ease-in-out shadow-lg relative overflow-hidden group"
              type="submit"
            >
              <span className="relative z-10 flex items-center justify-center">
                <FaDiceD20 className="mr-2" />
                Begin Your Quest
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </motion.button>
          </div>
        </form>
      </div>
      {/* Rules Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-yellow-500 text-2xl font-bold flex items-center">
              <FaScroll className="mr-2" /> Event Rules
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRuleLanguage(ruleLanguage === "EN" ? "TR" : "EN")}
            className="w-40 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            {ruleLanguage === "EN" ? "TR" : "EN"}
          </motion.button>
          <div className="text-gray-300 space-y-4">
            {rules[ruleLanguage].map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <FaCheck className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                <span>{rule}</span>
              </motion.div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(false)}
            className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Close
          </motion.button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default RegistrationForm;
